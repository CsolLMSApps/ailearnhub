-- ============================================
-- AFFILIATE SYSTEM TABLES
-- ============================================

-- Affiliates table
CREATE TABLE affiliates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Affiliate details
  affiliate_code TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, active, suspended
  
  -- Commission settings
  commission_rate DECIMAL(5,2) NOT NULL DEFAULT 30.00, -- 30% default
  commission_type TEXT NOT NULL DEFAULT 'percentage', -- percentage or fixed
  
  -- Payment details
  payment_email TEXT,
  payment_method TEXT, -- paypal, bank, stripe
  payment_details JSONB,
  minimum_payout INTEGER DEFAULT 5000, -- $50.00 in cents
  
  -- Stats
  total_referrals INTEGER DEFAULT 0,
  total_sales INTEGER DEFAULT 0,
  total_revenue INTEGER DEFAULT 0, -- in cents
  total_commission_earned INTEGER DEFAULT 0, -- in cents
  total_commission_paid INTEGER DEFAULT 0, -- in cents
  commission_pending INTEGER DEFAULT 0, -- in cents
  
  -- Metadata
  notes TEXT,
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Affiliate referrals (tracking clicks)
CREATE TABLE affiliate_referrals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  affiliate_id UUID REFERENCES affiliates(id) ON DELETE CASCADE,
  
  -- Visitor tracking
  visitor_id TEXT, -- Cookie or session ID
  ip_address INET,
  user_agent TEXT,
  referrer TEXT,
  
  -- Page visited
  landing_page TEXT,
  
  -- Conversion tracking
  converted BOOLEAN DEFAULT false,
  purchase_id UUID REFERENCES purchases(id),
  converted_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Affiliate commissions (individual transactions)
CREATE TABLE affiliate_commissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  affiliate_id UUID REFERENCES affiliates(id) ON DELETE CASCADE,
  purchase_id UUID REFERENCES purchases(id) ON DELETE CASCADE,
  referral_id UUID REFERENCES affiliate_referrals(id),
  
  -- Commission details
  sale_amount INTEGER NOT NULL, -- in cents
  commission_rate DECIMAL(5,2) NOT NULL,
  commission_amount INTEGER NOT NULL, -- in cents
  
  -- Status
  status TEXT NOT NULL DEFAULT 'pending', -- pending, approved, paid, reversed
  
  -- Payment tracking
  payout_id UUID, -- Reference to payout batch
  paid_at TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Affiliate payouts (batch payments)
CREATE TABLE affiliate_payouts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  affiliate_id UUID REFERENCES affiliates(id) ON DELETE CASCADE,
  
  -- Payout details
  amount INTEGER NOT NULL, -- in cents
  currency TEXT NOT NULL DEFAULT 'usd',
  
  -- Payment method
  payment_method TEXT NOT NULL, -- paypal, bank, stripe
  payment_details JSONB,
  payment_reference TEXT, -- External payment ID
  
  -- Status
  status TEXT NOT NULL DEFAULT 'pending', -- pending, processing, completed, failed
  
  -- Commissions included
  commission_ids UUID[], -- Array of commission IDs in this payout
  commission_count INTEGER DEFAULT 0,
  
  -- Processing
  processed_by UUID REFERENCES auth.users(id),
  processed_at TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Affiliate links (custom tracking links)
CREATE TABLE affiliate_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  affiliate_id UUID REFERENCES affiliates(id) ON DELETE CASCADE,
  
  -- Link details
  name TEXT NOT NULL,
  destination_url TEXT NOT NULL, -- /courses/chatgpt-mastery
  utm_campaign TEXT,
  utm_medium TEXT DEFAULT 'affiliate',
  utm_source TEXT, -- affiliate code
  
  -- Tracking
  click_count INTEGER DEFAULT 0,
  conversion_count INTEGER DEFAULT 0,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_affiliates_code ON affiliates(affiliate_code);
CREATE INDEX idx_affiliates_user ON affiliates(user_id);
CREATE INDEX idx_affiliates_status ON affiliates(status);

CREATE INDEX idx_referrals_affiliate ON affiliate_referrals(affiliate_id);
CREATE INDEX idx_referrals_visitor ON affiliate_referrals(visitor_id);
CREATE INDEX idx_referrals_converted ON affiliate_referrals(converted);
CREATE INDEX idx_referrals_created ON affiliate_referrals(created_at);

CREATE INDEX idx_commissions_affiliate ON affiliate_commissions(affiliate_id);
CREATE INDEX idx_commissions_purchase ON affiliate_commissions(purchase_id);
CREATE INDEX idx_commissions_status ON affiliate_commissions(status);
CREATE INDEX idx_commissions_payout ON affiliate_commissions(payout_id);

CREATE INDEX idx_payouts_affiliate ON affiliate_payouts(affiliate_id);
CREATE INDEX idx_payouts_status ON affiliate_payouts(status);

CREATE INDEX idx_links_affiliate ON affiliate_links(affiliate_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_links ENABLE ROW LEVEL SECURITY;

-- Affiliates: Users can view/update their own affiliate account
CREATE POLICY "Users can view own affiliate account"
  ON affiliates FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own affiliate account"
  ON affiliates FOR UPDATE
  USING (auth.uid() = user_id);

-- Referrals: No direct access (system managed)
CREATE POLICY "No direct access to referrals"
  ON affiliate_referrals FOR SELECT
  USING (false);

-- Commissions: Affiliates can view their own
CREATE POLICY "Affiliates can view own commissions"
  ON affiliate_commissions FOR SELECT
  USING (
    affiliate_id IN (
      SELECT id FROM affiliates WHERE user_id = auth.uid()
    )
  );

-- Payouts: Affiliates can view their own
CREATE POLICY "Affiliates can view own payouts"
  ON affiliate_payouts FOR SELECT
  USING (
    affiliate_id IN (
      SELECT id FROM affiliates WHERE user_id = auth.uid()
    )
  );

-- Links: Affiliates can manage their own
CREATE POLICY "Affiliates can manage own links"
  ON affiliate_links FOR ALL
  USING (
    affiliate_id IN (
      SELECT id FROM affiliates WHERE user_id = auth.uid()
    )
  );

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to generate unique affiliate code
CREATE OR REPLACE FUNCTION generate_affiliate_code()
RETURNS TEXT AS $$
DECLARE
  new_code TEXT;
  code_exists BOOLEAN;
BEGIN
  LOOP
    -- Generate 8-character code (uppercase letters and numbers)
    new_code := upper(substring(md5(random()::text) from 1 for 8));
    
    -- Check if code already exists
    SELECT EXISTS(SELECT 1 FROM affiliates WHERE affiliate_code = new_code) INTO code_exists;
    
    -- Exit loop if code is unique
    EXIT WHEN NOT code_exists;
  END LOOP;
  
  RETURN new_code;
END;
$$ LANGUAGE plpgsql;

-- Function to track affiliate referral
CREATE OR REPLACE FUNCTION track_affiliate_referral(
  p_affiliate_code TEXT,
  p_visitor_id TEXT,
  p_ip_address INET,
  p_user_agent TEXT,
  p_referrer TEXT,
  p_landing_page TEXT
)
RETURNS UUID AS $$
DECLARE
  v_affiliate_id UUID;
  v_referral_id UUID;
BEGIN
  -- Get affiliate ID from code
  SELECT id INTO v_affiliate_id
  FROM affiliates
  WHERE affiliate_code = p_affiliate_code AND status = 'active';
  
  -- If affiliate not found or not active, return null
  IF v_affiliate_id IS NULL THEN
    RETURN NULL;
  END IF;
  
  -- Create referral record
  INSERT INTO affiliate_referrals (
    affiliate_id,
    visitor_id,
    ip_address,
    user_agent,
    referrer,
    landing_page
  ) VALUES (
    v_affiliate_id,
    p_visitor_id,
    p_ip_address,
    p_user_agent,
    p_referrer,
    p_landing_page
  )
  RETURNING id INTO v_referral_id;
  
  -- Update affiliate stats
  UPDATE affiliates
  SET total_referrals = total_referrals + 1
  WHERE id = v_affiliate_id;
  
  RETURN v_referral_id;
END;
$$ LANGUAGE plpgsql;

-- Function to process affiliate commission on purchase
CREATE OR REPLACE FUNCTION process_affiliate_commission()
RETURNS TRIGGER AS $$
DECLARE
  v_referral_id UUID;
  v_affiliate_id UUID;
  v_commission_rate DECIMAL(5,2);
  v_commission_amount INTEGER;
BEGIN
  -- Only process if purchase is completed
  IF NEW.status != 'completed' THEN
    RETURN NEW;
  END IF;
  
  -- Find recent referral for this user (within last 30 days)
  SELECT r.id, r.affiliate_id
  INTO v_referral_id, v_affiliate_id
  FROM affiliate_referrals r
  JOIN affiliates a ON r.affiliate_id = a.id
  WHERE r.visitor_id = NEW.user_id::TEXT
    AND r.converted = false
    AND r.created_at > NOW() - INTERVAL '30 days'
    AND a.status = 'active'
  ORDER BY r.created_at DESC
  LIMIT 1;
  
  -- If no referral found, exit
  IF v_referral_id IS NULL THEN
    RETURN NEW;
  END IF;
  
  -- Get commission rate
  SELECT commission_rate INTO v_commission_rate
  FROM affiliates
  WHERE id = v_affiliate_id;
  
  -- Calculate commission
  v_commission_amount := FLOOR(NEW.amount_paid * v_commission_rate / 100);
  
  -- Mark referral as converted
  UPDATE affiliate_referrals
  SET converted = true,
      purchase_id = NEW.id,
      converted_at = NOW()
  WHERE id = v_referral_id;
  
  -- Create commission record
  INSERT INTO affiliate_commissions (
    affiliate_id,
    purchase_id,
    referral_id,
    sale_amount,
    commission_rate,
    commission_amount,
    status
  ) VALUES (
    v_affiliate_id,
    NEW.id,
    v_referral_id,
    NEW.amount_paid,
    v_commission_rate,
    v_commission_amount,
    'pending'
  );
  
  -- Update affiliate stats
  UPDATE affiliates
  SET 
    total_sales = total_sales + 1,
    total_revenue = total_revenue + NEW.amount_paid,
    total_commission_earned = total_commission_earned + v_commission_amount,
    commission_pending = commission_pending + v_commission_amount
  WHERE id = v_affiliate_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to process commission on purchase
CREATE TRIGGER trigger_process_affiliate_commission
  AFTER INSERT OR UPDATE ON purchases
  FOR EACH ROW
  EXECUTE FUNCTION process_affiliate_commission();

-- ============================================
-- INITIAL DATA
-- ============================================

-- No initial data needed
-- Affiliates will sign up through the platform

-- Run this SQL script manually in your Supabase SQL Editor
-- to create the swap_requests table

-- Create swap_requests table
CREATE TABLE IF NOT EXISTS swap_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add unique constraint to prevent duplicate pending requests
ALTER TABLE swap_requests ADD CONSTRAINT unique_pending_request 
    UNIQUE (sender_id, receiver_id, status);

-- Create index for performance
CREATE INDEX idx_swap_requests_sender ON swap_requests(sender_id);
CREATE INDEX idx_swap_requests_receiver ON swap_requests(receiver_id);
CREATE INDEX idx_swap_requests_status ON swap_requests(status);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_swap_requests_updated_at 
    BEFORE UPDATE ON swap_requests 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE swap_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can view their own sent and received requests
CREATE POLICY "Users can view their own swap requests" ON swap_requests
    FOR SELECT USING (
        auth.uid() = sender_id OR 
        auth.uid() = receiver_id
    );

-- Users can create swap requests (as sender)
CREATE POLICY "Users can create swap requests" ON swap_requests
    FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Users can update their sent requests
CREATE POLICY "Senders can update their requests" ON swap_requests
    FOR UPDATE USING (auth.uid() = sender_id);

-- Users can update requests they received (to accept/reject)
CREATE POLICY "Receivers can update received requests" ON swap_requests
    FOR UPDATE USING (auth.uid() = receiver_id);

-- Users can delete their sent requests
CREATE POLICY "Senders can delete their requests" ON swap_requests
    FOR DELETE USING (auth.uid() = sender_id);

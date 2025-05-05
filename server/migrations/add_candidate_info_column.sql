-- Add candidate_info column as JSONB type to job_applications table
ALTER TABLE job_applications 
ADD COLUMN candidate_info JSONB;

-- Add a comment to document the column's purpose
COMMENT ON COLUMN job_applications.candidate_info IS 'Stores candidate location data including IP address, timezone, and capture timestamp';

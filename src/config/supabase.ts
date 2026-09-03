import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ssgtblvierbypgoguzkg.supabase.co';
const supabaseAnonKey = 'sb_publishable_mt_VkUo_S32q_-QC9s9VFQ_Kwr1btZL';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

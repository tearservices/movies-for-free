import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nkjizlebtlmgmtqaonot.supabase.co';
const supabaseKey = 'sb_publishable_6orhng6zssRe45KcOFnqXQ_78xgw6Oc';

export const supabase = createClient(supabaseUrl, supabaseKey);

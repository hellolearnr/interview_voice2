# AI Voice Recruiter - Debug Setup

**Live Demo**: https://airecruiter-app.vercel.app  
**Stack**: Next.js + React + Vapi + Supabase + AI
##important instruction
do not change the main codebase. all i want is to debug where and why it is not working as expected. so add debug test cases to add to the code.
## Quick Debug Setup (Non-invasive)

### 1. Environment Check
```bash
# Create: debug/check.js
node -e "
const required = ['NEXT_PUBLIC_SUPABASE_URL','VAPI_API_KEY','OPENAI_API_KEY'];
required.forEach(v => console.log(v + ':', process.env[v] ? '✅' : '❌'));
"
```

### 2. Health Check API
```javascript
// pages/api/debug.js - Single endpoint for all checks
export default async function handler(req, res) {
  const checks = { supabase: 'unknown', vapi: 'unknown' };
  
  // Test Supabase
  try {
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
    const { error } = await supabase.from('profiles').select('count').limit(1);
    checks.supabase = error ? 'error' : 'ok';
  } catch (e) { checks.supabase = 'error'; }
  
  // Test Vapi
  try {
    const vapiRes = await fetch('https://api.vapi.ai/call', {
      headers: { 'Authorization': `Bearer ${process.env.VAPI_API_KEY}` }
    });
    checks.vapi = vapiRes.ok ? 'ok' : 'error';
  } catch (e) { checks.vapi = 'error'; }
  
  res.json(checks);
}
```

### 3. Simple Debug Component
```jsx
// Add to any page: <DebugPanel show={process.env.NODE_ENV === 'development'} />
function DebugPanel({ show }) {
  const [status, setStatus] = useState(null);
  
  useEffect(() => {
    if (show) fetch('/api/debug').then(r => r.json()).then(setStatus);
  }, [show]);
  
  if (!show || !status) return null;
  
  return (
    <div className="fixed top-2 right-2 bg-black text-white p-2 text-xs rounded">
      Supabase: {status.supabase} | Vapi: {status.vapi}
    </div>
  );
}
```

### 4. Console Debug Helper
```javascript
// Add to _app.js - Press Ctrl+` to log debug info
useEffect(() => {
  window.debug = () => {
    fetch('/api/debug').then(r => r.json()).then(console.table);
    console.log('Environment:', process.env.NODE_ENV);
  };
}, []);
```

## Quick Commands
```bash
# Health check
curl localhost:3000/api/debug

# Environment check  
node debug/check.js

# Console debug (in browser)
debug()
```

## Common Issues
- **Vapi**: Check API key, webhook URLs
- **Supabase**: Verify RLS policies, connection string
- **AI**: Monitor token usage, response formatting

**Debug Mode**: Add `?debug=1` to any URL to show debug info.
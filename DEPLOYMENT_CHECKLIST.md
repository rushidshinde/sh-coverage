# Deployment Checklist

Use this checklist to ensure a smooth deployment to Webflow Cloud.

## ✅ Pre-Deployment

### 1. Environment Variables
- [ ] Obtained Webflow Site ID
- [ ] Obtained Webflow Collection ID
- [ ] Generated Webflow API Token
- [ ] Generated Webhook Secret (32+ characters)
- [ ] Updated `.env` file with real values
- [ ] Tested locally with real credentials

### 2. Local Testing
- [ ] Ran `npm install` successfully
- [ ] Ran `npm run dev` without errors
- [ ] Called `/api/cms/fetch` successfully
- [ ] Verified cache populated with items
- [ ] Tested `/api/cms/search` with queries
- [ ] Checked `/api/cms/stats` shows cache data
- [ ] Tested webhook endpoint (optional)

### 3. Code Quality
- [ ] Ran `npm run build` successfully
- [ ] No TypeScript errors
- [ ] Reviewed all API responses
- [ ] Verified error handling works

---

## 🚀 Deployment to Webflow Cloud

### 1. Prepare Repository
- [ ] Code committed to Git repository
- [ ] `.env` file is in `.gitignore` (don't commit secrets!)
- [ ] All documentation files included
- [ ] `README.md` updated with project-specific info

### 2. Webflow Cloud Setup
- [ ] Logged into Webflow Cloud dashboard
- [ ] Created/selected your app
- [ ] Connected Git repository
- [ ] Selected correct branch

### 3. Configure Environment Variables in Webflow Cloud
- [ ] Added `WEBFLOW_SITE_ID`
- [ ] Added `WEBFLOW_COLLECTION_ID`
- [ ] Added `WEBFLOW_API_TOKEN`
- [ ] Added `WEBFLOW_API_HOST` (optional, default: https://api.webflow.com)
- [ ] Added `WEBHOOK_SECRET`
- [ ] **Note**: Do NOT set `NEXT_PUBLIC_BASE_PATH` (auto-set by Webflow Cloud)

### 4. Deploy
- [ ] Triggered deployment
- [ ] Waited for build to complete
- [ ] Verified deployment succeeded
- [ ] Noted the production URL

---

## 🧪 Post-Deployment Testing

### 1. Warm Up Cache
```bash
# Replace with your actual production URL
curl https://your-app.webflow.io/api/cms/fetch
```
- [ ] Request succeeded
- [ ] Received success response with item count
- [ ] No error messages

### 2. Test Search
```bash
curl "https://your-app.webflow.io/api/cms/search?q=test"
```
- [ ] Search returns results
- [ ] Pagination info present
- [ ] Cache metadata included

### 3. Verify Stats
```bash
curl https://your-app.webflow.io/api/cms/stats
```
- [ ] Cache shows as existing
- [ ] Item count matches expected
- [ ] Last updated timestamp is recent

### 4. Test Home Page
- [ ] Visited home page in browser
- [ ] API documentation displays correctly
- [ ] All links work
- [ ] Styling loads properly

---

## 🔗 Configure Webhooks in Webflow

### 1. Access Webhook Settings
- [ ] Logged into Webflow Designer
- [ ] Opened your site project
- [ ] Navigated to **Project Settings** > **Integrations** > **Webhooks**

### 2. Create Webhook
- [ ] Clicked **Add Webhook**
- [ ] Set name: "CMS Cache Refresh"
- [ ] Set URL: `https://your-app.webflow.io/api/cms/webhook`
- [ ] Selected trigger types:
    - [ ] Collection Item Created
    - [ ] Collection Item Changed
    - [ ] Collection Item Deleted
    - [ ] Collection Item Unpublished

### 3. Add Authentication Header
- [ ] Added custom header:
    - **Key**: `Authorization`
    - **Value**: `Bearer your_webhook_secret`
- [ ] Saved webhook configuration

### 4. Test Webhook
- [ ] Made a change to a CMS item
- [ ] Published the change
- [ ] Verified webhook was triggered (check logs if available)
- [ ] Called `/api/cms/stats` to verify cache updated

---

## 📊 Monitoring Setup

### 1. Initial Monitoring
- [ ] Bookmarked production URLs for easy access
- [ ] Set up alerts for deployment failures (if available)
- [ ] Documented expected cache size

### 2. Regular Checks
Create a monitoring routine:
- [ ] Daily: Check `/api/cms/stats` for cache health
- [ ] Weekly: Verify webhook still working
- [ ] Monthly: Review API token expiration

### 3. Performance Baseline
Record initial performance metrics:
- [ ] Average search response time: ____ms
- [ ] Cache refresh time: ____s
- [ ] Number of CMS items: ____
- [ ] Last updated: ____

---

## 🔧 Troubleshooting

### If Deployment Fails

**Check:**
- [ ] Build logs in Webflow Cloud dashboard
- [ ] All dependencies in `package.json`
- [ ] Node.js version compatibility
- [ ] Environment variables set correctly

### If APIs Don't Work

**Verify:**
- [ ] Environment variables in Webflow Cloud (not just `.env`)
- [ ] API token has correct permissions
- [ ] Site ID and Collection ID are correct
- [ ] Cache initialized with `/api/cms/fetch`

### If Webhooks Fail

**Confirm:**
- [ ] Webhook URL is correct and publicly accessible
- [ ] Authorization header matches `WEBHOOK_SECRET`
- [ ] Trigger types are selected
- [ ] CMS changes are being published (not just saved as drafts)

---

## 📝 Documentation Updates

### Update These Files (if needed)
- [ ] `README.md` - Add production URL
- [ ] `SETUP_GUIDE.md` - Note any deployment-specific steps
- [ ] Internal docs - Document your specific implementation

### Share With Team
- [ ] Production URL
- [ ] API endpoint documentation
- [ ] Webhook configuration details
- [ ] Environment variable locations

---

## 🎯 Success Criteria

Your deployment is successful when:

✅ **API Endpoints**
- `/api/cms/fetch` returns success with item count
- `/api/cms/search` returns results
- `/api/cms/stats` shows cache status
- `/api/cms/webhook` responds to Webflow events

✅ **Performance**
- Search responses < 100ms
- Cache refresh < 10 seconds
- Home page loads quickly

✅ **Integration**
- Webhooks trigger automatically
- Cache updates on CMS changes
- No authentication errors

✅ **Monitoring**
- Can check cache status anytime
- Error logs accessible (if available)
- Performance metrics tracked

---

## 🚨 Rollback Plan

If issues occur after deployment:

1. **Identify Issue**
    - [ ] Check error logs
    - [ ] Test each endpoint
    - [ ] Verify environment variables

2. **Quick Fixes**
    - [ ] Re-initialize cache: Call `/api/cms/fetch`
    - [ ] Verify environment variables
    - [ ] Check API token validity

3. **Rollback (if needed)**
    - [ ] Revert to previous deployment in Webflow Cloud
    - [ ] Notify team of rollback
    - [ ] Document what went wrong
    - [ ] Fix issues in development
    - [ ] Redeploy when ready

---

## 📱 Post-Deployment Tasks

### Immediate (First Hour)
- [ ] Initialize cache
- [ ] Test all endpoints
- [ ] Verify webhooks
- [ ] Check performance

### First Day
- [ ] Monitor error rates
- [ ] Test with real users
- [ ] Verify cache stays populated
- [ ] Check webhook logs

### First Week
- [ ] Monitor cache hit rates
- [ ] Review search queries
- [ ] Optimize if needed
- [ ] Document any issues

---

## 🎉 Deployment Complete!

When all items are checked:

✅ Application deployed to production  
✅ Environment variables configured  
✅ Cache initialized and working  
✅ All endpoints tested and functional  
✅ Webhooks configured and tested  
✅ Monitoring in place  
✅ Team notified

**Your Webflow CMS API is live!** 🚀

---

## 📞 Support Resources

**If you need help:**
- 📚 Check `SETUP_GUIDE.md` for configuration help
- 📚 See `API_EXAMPLES.md` for usage examples
- 📚 Review `README.md` for architecture details
- 📧 Contact Webflow Support for API issues
- 📧 Check Webflow Cloud docs for deployment issues

---

## 🔄 Regular Maintenance

### Weekly
- [ ] Check cache statistics
- [ ] Verify webhooks still triggering
- [ ] Review any error logs

### Monthly
- [ ] Update dependencies (if needed)
- [ ] Review API token expiration
- [ ] Check for Webflow API changes
- [ ] Optimize cache strategy if needed

### Quarterly
- [ ] Full system test
- [ ] Performance review
- [ ] Security audit
- [ ] Documentation update

---

**Checklist completed? Congratulations! 🎊**

Your Webflow CMS API is fully deployed and operational.

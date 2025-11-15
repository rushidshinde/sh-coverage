# Quick Start Guide

Get your Webflow CMS API up and running in 5 minutes!

## ⚡ 5-Minute Setup

### 1. Configure Environment Variables (2 min)

Edit the `.env` file in the project root:

```env
WEBFLOW_SITE_ID=your_site_id
WEBFLOW_COLLECTION_ID=your_collection_id
WEBFLOW_API_TOKEN=your_api_token
WEBHOOK_SECRET=generate_a_random_string
```

**Where to find these?** See [`SETUP_GUIDE.md`](SETUP_GUIDE.md) for detailed instructions.

### 2. Install & Run (1 min)

```bash
npm install
npm run dev
```

### 3. Initialize Cache (1 min)

Open your browser and visit:
```
http://localhost:3000/api/cms/fetch
```

### 4. Test Search (1 min)

```
http://localhost:3000/api/cms/search?q=your-search-term
```

## ✅ That's it! Your API is ready.

---

## 🚀 Essential Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Run production server |

---

## 📍 API Endpoints

| Endpoint | Purpose |
|----------|---------|
| `GET /api/cms/fetch` | Fetch & cache all CMS items |
| `GET /api/cms/search?q=query` | Search cached items |
| `GET /api/cms/stats` | Get cache status |
| `POST /api/cms/webhook` | Webhook for auto-refresh |

---

## 🔧 Common Tasks

### Check cache status
```bash
curl http://localhost:3000/api/cms/stats
```

### Refresh cache manually
```bash
curl http://localhost:3000/api/cms/fetch
```

### Search with pagination
```bash
curl "http://localhost:3000/api/cms/search?q=product&limit=10&offset=0"
```

---

## 🐛 Troubleshooting

### Cache not found?
→ Run `/api/cms/fetch` first

### Environment variables not working?
→ Restart dev server after editing `.env`

### Webhook returns 401?
→ Check `Authorization: Bearer {WEBHOOK_SECRET}` header

---

## 📚 Documentation

- **Full Setup Guide**: [`SETUP_GUIDE.md`](SETUP_GUIDE.md)
- **API Examples**: [`API_EXAMPLES.md`](API_EXAMPLES.md)
- **README**: [`README.md`](README.md)

---

## 🎯 Next Steps

1. ✅ Test all endpoints locally
2. ✅ Set up webhooks in Webflow
3. ✅ Deploy to Webflow Cloud
4. ✅ Update webhook URL to production

---

## 💡 Pro Tips

- **Performance**: Cache is in-memory and fast
- **Webhooks**: Auto-refresh on CMS updates
- **Search**: Searches item names, case-insensitive
- **Pagination**: Use `limit` and `offset` parameters

---

## Need Help?

- 📖 Check [`SETUP_GUIDE.md`](SETUP_GUIDE.md) for detailed instructions
- 📖 See [`API_EXAMPLES.md`](API_EXAMPLES.md) for code examples
- 📖 Read the full [`README.md`](README.md) for architecture details

**Happy coding! 🎉**

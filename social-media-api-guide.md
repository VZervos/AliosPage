# Social Media Integration Guide

## Option 1: Facebook Page Plugin (Easiest - Recommended)

The simplest way is to use Facebook's Page Plugin embed. This doesn't require API keys.

### Steps:
1. Go to: https://developers.facebook.com/docs/plugins/page-plugin
2. Enter your Facebook page URL: `https://www.facebook.com/corfuallios`
3. Configure the plugin (width, height, etc.)
4. Copy the generated code
5. Replace the carousel section with the embed code

## Option 2: Facebook Graph API (For Custom Display)

### Getting Access Token:
1. Go to https://developers.facebook.com/
2. Create a new app
3. Get a Page Access Token:
   - Go to Graph API Explorer: https://developers.facebook.com/tools/explorer/
   - Select your app
   - Generate a User Token with `pages_read_engagement` permission
   - Exchange for Page Token

### API Endpoint:
```
https://graph.facebook.com/v18.0/{page-id}/posts?access_token={your-token}&fields=message,created_time,full_picture,permalink_url&limit=5
```

## Option 3: Instagram Basic Display API

### Getting Access Token:
1. Go to https://developers.facebook.com/
2. Create an Instagram app
3. Add Instagram Basic Display product
4. Configure OAuth redirect URIs
5. Generate access token (requires user login)

### API Endpoint:
```
https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,timestamp&access_token={your-token}
```

## Option 4: RSS Feed (If Available)

Some Facebook pages have RSS feeds:
```
https://www.facebook.com/feeds/page.php?format=rss20&id={page-id}
```

## Security Note:
⚠️ **Never expose API tokens in client-side JavaScript for production!**
- Use a backend server to fetch posts
- Or use Facebook Page Plugin (no tokens needed)
- Or use environment variables and a build process


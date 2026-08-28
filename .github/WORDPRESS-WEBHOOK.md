WordPress → GitHub repository_dispatch webhook

This repository contains GitHub Actions workflows that will deploy the static site to Vercel when a `repository_dispatch` event is received (type `wordpress-update` or `wp_publish`).

Setup steps:

- Add a repository secret named `VERCEL_TOKEN` (Personal Vercel token).
- Create a GitHub Personal Access Token (PAT) with `repo` scope for the webhook sender.

Example cURL to trigger the workflow (replace placeholders):

```
curl -X POST \
  -H "Accept: application/vnd.github.v3+json" \
  -H "Authorization: token <GITHUB_PAT>" \
  https://api.github.com/repos/<owner>/<repo>/dispatches \
  -d '{"event_type": "wordpress-update", "client_payload": {"post_id": 123, "timestamp": "2025-01-01T12:00:00Z"}}'
```

Simple PHP snippet you can add to WordPress (example):

```
<?php
$url = 'https://api.github.com/repos/<owner>/<repo>/dispatches';
$data = array('event_type' => 'wordpress-update', 'client_payload' => array('post_id' => $post_id));
$payload = json_encode($data);
$headers = array(
  'Content-Type: application/json',
  'User-Agent: WP-Webhook',
  'Authorization: token <GITHUB_PAT>'
);
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');
curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$result = curl_exec($ch);
curl_close($ch);
?>
```

Adjust domain, repo owner, and token values before using.

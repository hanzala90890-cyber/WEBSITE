import { neon } from '@neondatabase/serverless';

const db = neon(process.env.DATABASE_URL!);

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'vaporix2026';

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export default async function(req: Request) {
  const url = new URL(req.url);
  const pathParts = url.pathname.split('/').filter(Boolean);
  const productId = pathParts[0];

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers });
  }

  try {
    if (req.method === 'GET') {
      if (productId) {
        const result = await db`SELECT id, name, price, img, description AS desc, created_at, updated_at FROM products WHERE id = ${productId}`;
        if (result.length === 0) {
          return new Response(JSON.stringify({ error: 'Product not found' }), { status: 404, headers });
        }
        return new Response(JSON.stringify(result[0]), { status: 200, headers });
      }
      const result = await db`SELECT id, name, price, img, description AS desc, created_at, updated_at FROM products ORDER BY created_at DESC`;
      return new Response(JSON.stringify(result), { status: 200, headers });
    }

    const authHeader = req.headers.get('Authorization');
    const isAuthorized = authHeader && authHeader.startsWith('Bearer ') && authHeader.substring(7) === ADMIN_TOKEN;

    if (!isAuthorized && req.method !== 'GET') {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers });
    }

    if (req.method === 'POST') {
      const body = await req.json();
      const id = body.id || 'p' + Date.now();
      await db`INSERT INTO products (id, name, price, img, description, created_at, updated_at) VALUES (${id}, ${body.name}, ${body.price}, ${body.img}, ${body.desc}, NOW(), NOW())`;
      const result = await db`SELECT id, name, price, img, description AS desc, created_at, updated_at FROM products WHERE id = ${id}`;
      return new Response(JSON.stringify(result[0]), { status: 201, headers });
    }

    if (req.method === 'PUT') {
      if (!productId) {
        return new Response(JSON.stringify({ error: 'Product ID required' }), { status: 400, headers });
      }
      const body = await req.json();
      await db`UPDATE products SET name = ${body.name}, price = ${body.price}, img = ${body.img}, description = ${body.desc}, updated_at = NOW() WHERE id = ${productId}`;
      const result = await db`SELECT id, name, price, img, description AS desc, created_at, updated_at FROM products WHERE id = ${productId}`;
      return new Response(JSON.stringify(result[0]), { status: 200, headers });
    }

    if (req.method === 'DELETE') {
      if (!productId) {
        return new Response(JSON.stringify({ error: 'Product ID required' }), { status: 400, headers });
      }
      await db`DELETE FROM products WHERE id = ${productId}`;
      return new Response(JSON.stringify({ success: true }), { status: 200, headers });
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers });
  } catch (err: any) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message || 'Internal server error' }), { status: 500, headers });
  }
}

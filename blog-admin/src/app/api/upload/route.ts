import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json({ success: false, error: 'Storage not configured' }, { status: 500 });
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = (formData.get('folder') as string) || 'blog-images';

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    const ext = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    const { error } = await supabaseAdmin.storage
      .from('images')
      .upload(fileName, buffer, { contentType: file.type, upsert: false });

    if (error) {
      // Try to create the bucket if it doesn't exist
      if (error.message?.includes('not found') || error.message?.includes('Bucket')) {
        await supabaseAdmin.storage.createBucket('images', { public: true });
        const { error: retryError } = await supabaseAdmin.storage
          .from('images')
          .upload(fileName, buffer, { contentType: file.type, upsert: false });
        if (retryError) throw retryError;
      } else {
        throw error;
      }
    }

    const { data } = supabaseAdmin.storage.from('images').getPublicUrl(fileName);

    return NextResponse.json({ success: true, url: data.publicUrl });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getTenantId } from '@/lib/session';

interface Props {
  params: Promise<{ id: string }>;
}

// GET a single post by ID (scoped to tenant)
export async function GET(request: NextRequest, { params }: Props) {
  try {
    const tenantId = await getTenantId(request);
    if (!tenantId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const post = await prisma.post.findFirst({
      where: { id, tenantId },
      include: { author: true, category: true, tags: true },
    });

    if (!post) {
      return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: post });
  } catch (error: any) {
    console.error('Failed to fetch post:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch post' }, { status: 500 });
  }
}

// PUT update a post by ID (scoped to tenant)
export async function PUT(request: NextRequest, { params }: Props) {
  try {
    const tenantId = await getTenantId(request);
    if (!tenantId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    
    // Ensure the post exists and belongs to the tenant
    const existingPost = await prisma.post.findFirst({
      where: { id, tenantId }
    });

    if (!existingPost) {
      return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
    }

    const body = await request.json();

    let categoryUpdate: any = undefined;
    let categoryIdUpdate: any = undefined;

    if (body.categoryName !== undefined) {
      if (body.categoryName && body.categoryName.trim() !== '') {
        const catName = body.categoryName.trim();
        categoryUpdate = {
          connectOrCreate: {
            where: { tenantId_name: { tenantId, name: catName } },
            create: { 
              name: catName, 
              slug: catName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
              tenantId
            }
          }
        };
      } else {
        categoryIdUpdate = null; // Clear category link if empty
      }
    }

    let tagsUpdate: any = undefined;
    if (body.tagNames !== undefined) {
      const tagsArray = body.tagNames.split(',').map((t: string) => t.trim()).filter((t: string) => t !== '');
      tagsUpdate = {
        set: [],
        connectOrCreate: tagsArray.map((tagName: string) => ({
          where: { tenantId_name: { tenantId, name: tagName } },
          create: { 
            name: tagName, 
            slug: tagName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
            tenantId
          }
        }))
      };
    }

    // Ensure slug is unique within tenant (excluding current post)
    let slug = body.slug;
    if (slug) {
      const conflict = await prisma.post.findFirst({
        where: { tenantId, slug, id: { not: id } }
      });
      if (conflict) {
        slug = `${slug}-${Date.now()}`;
      }
    }

    const post = await prisma.post.update({
      where: { id },
      data: {
        title: body.title,
        slug,
        content: body.content,
        excerpt: body.excerpt,
        coverImage: body.coverImage,
        seoTitle: body.seoTitle,
        seoDescription: body.seoDescription,
        status: body.status,
        category: categoryUpdate,
        categoryId: categoryIdUpdate,
        tags: tagsUpdate,
        publishedAt: body.publishedAt ? new Date(body.publishedAt) : undefined,
      },
    });

    return NextResponse.json({ success: true, data: post });
  } catch (error: any) {
    console.error('Failed to update post:', error);
    return NextResponse.json({ success: false, error: 'Failed to update post' }, { status: 500 });
  }
}

// DELETE a post by ID (scoped to tenant)
export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    const tenantId = await getTenantId(request);
    if (!tenantId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Ensure the post exists and belongs to the tenant
    const existingPost = await prisma.post.findFirst({
      where: { id, tenantId }
    });

    if (!existingPost) {
      return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
    }

    await prisma.post.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Post deleted successfully' });
  } catch (error: any) {
    console.error('Failed to delete post:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete post' }, { status: 500 });
  }
}

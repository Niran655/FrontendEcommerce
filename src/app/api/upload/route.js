import { NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import sharp from 'sharp';

export async function POST(request) {
  try {
    console.log('Upload API called');
    
    const formData = await request.formData();
    const imageFile = formData.get('image');
    const cropData = formData.get('cropData');

    if (!imageFile) {
      return NextResponse.json(
        { success: false, error: 'No image file provided' },
        { status: 400 }
      );
    }

   
    if (!(imageFile instanceof File)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file format' },
        { status: 400 }
      );
    }

    console.log('File received:', imageFile.name, imageFile.size); // Debug log

    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let processedImage;
    
    if (cropData) {
      const crop = JSON.parse(cropData);
      processedImage = await sharp(buffer)
        .extract({
          left: Math.round(crop.x),
          top: Math.round(crop.y),
          width: Math.round(crop.width),
          height: Math.round(crop.height),
        })
        .resize(800, 600)
        .jpeg({ quality: 80 })
        .toBuffer();
    } else {
      // Just resize without cropping
      processedImage = await sharp(buffer)
        .resize(800, 600)
        .jpeg({ quality: 80 })
        .toBuffer();
    }

    // Connect to MongoDB
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not set');
    }

    const client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db();

  
    const result = await db.collection('images').insertOne({
      image: processedImage.toString('base64'),
      filename: imageFile.name,
      contentType: 'image/jpeg',
      createdAt: new Date(),
      cropData: cropData ? JSON.parse(cropData) : null,
    });

    await client.close();

    const imageUrl = `data:image/jpeg;base64,${processedImage.toString('base64')}`;
    
    return NextResponse.json({
      success: true,
      imageId: result.insertedId,
      imageUrl: imageUrl,
      message: 'Image uploaded successfully'
    });

  } catch (error) {
    console.error('Upload error details:', error);
    
 
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to upload image',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Upload API is working',
    timestamp: new Date().toISOString()
  });
}
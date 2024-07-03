import {
    json
} from '@sveltejs/kit';
import connectToDatabase from '$lib/mongoose';
import In from '$lib/models/In';
import {
    z
} from 'zod';

const inSchema = z.object({
    no_surat_jalan: z.string().min(1, {
        message: "No Surat Jalan is required"
    }),
    tanggal: z.string().min(1, {
        message: "Tanggal is required"
    }),
    nama_supplier: z.string().min(1, {
        message: "Nama Supplier is required"
    }),
    nama_barang: z.string().min(1, {
        message: "Nama Barang is required"
    }),
    qty: z.number().int().positive().min(1, {
        message: "Qty is required"
    })
});

/** @type {import('./$types').RequestHandler} */
//get ins
export async function GET({
    url
}) {
    // Get query parameters
    const page = url.searchParams.get('page') || 1;
    const limit = url.searchParams.get('limit') || 5;
    const search = url.searchParams.get('search') || '';
    // Set query search
    const querySearch = search ? {
        $or: [{
                no_surat_jalan: {
                    $regex: search,
                    $options: 'i'
                }
            },
            {
                nama_supplier: {
                    $regex: search,
                    $options: 'i'
                }
            },
            {
                nama_barang: {
                    $regex: search,
                    $options: 'i'
                }
            }
        ]
    } : {};

    // Connect to database
    await connectToDatabase();
    // Get total documents
    const totalIns = await In.countDocuments();
    // Calculate total pages
    const totalPages = Math.ceil(totalIns / limit);
    // Calculate the offset
    const offset = (page - 1) * limit;
    // Get ins with pagination
    const ins = await In.find(querySearch).skip(offset).limit(limit);

    // Return response success
    return json({
        status: 'success',
        message: 'Ins read successfully',
        data: ins,
        pagination: {
            page,
            limit,
            totalPages,
            totalIns
        }
    });
}

//post ins
export async function POST({
    request
}) {

    // Connect to database
    await connectToDatabase();

    // Get request body
    const body = await request.json();

    // Validate request body using Zod schema
    try {
        const validatedData = inSchema.parse(body);

        // Create new In instance
        const newIn = new In({
            no_surat_jalan: validatedData.no_surat_jalan,
            tanggal: validatedData.tanggal,
            nama_supplier: validatedData.nama_supplier,
            nama_barang: validatedData.nama_barang,
            qty: validatedData.qty
        });

        // save data to database
        const savedIn = await newIn.save();

        // response success
        return json({
            status: 'success',
            message: 'In created successfully',
            data: savedIn
        }, {
            status: 201
        });
        // response error
    } catch (error) {
        return json({
            status: 'error',
            message: 'Validation failed',
            errors: error.errors
        }, {
            status: 400
        });
    }
}

//put ins
export async function PUT({
    request,
    url
}) {
    // Connect to database
    await connectToDatabase();

    // Get request body
    const body = await request.json();

    // Get the id from the URL
    const id = url.searchParams.get('id');
    if (!id) {
        return new Response(JSON.stringify({
            status: 'error',
            message: 'ID is required'
        }), {
            status: 400,
        });
    }

    // Validate request body using Zod schema
    try {
        const validatedData = inSchema.parse(body);

        // Update In instance
        const updatedIn = await In.findByIdAndUpdate(id, validatedData, {
            new: true
        });

        if (!updatedIn) {
            return new Response(JSON.stringify({
                status: 'error',
                message: 'In not found'
            }), {
                status: 404,
            });
        }

        // response success
        return new Response(JSON.stringify({
            status: 'success',
            message: 'In updated successfully',
            data: updatedIn
        }), {
            status: 200,
        });
    } catch (error) {
        // response error
        return new Response(JSON.stringify({
            status: 'error',
            message: 'Validation failed',
            errors: error.errors
        }), {
            status: 400,
        });
    }
}

//delete ins
export async function DELETE({
    url
}) {
    // Connect to database
    await connectToDatabase();

    // Get the id from the URL
    const id = url.searchParams.get('id');
    if (!id) {
        return new Response(JSON.stringify({
            status: 'error',
            message: 'ID is required'
        }), {
            status: 400
        });
    }

    try {
        // Delete In instance
        const deletedIn = await In.findByIdAndDelete(id);

        if (!deletedIn) {
            return new Response(JSON.stringify({
                status: 'error',
                message: 'In not found'
            }), {
                status: 404
            });
        }

        // response success
        return new Response(JSON.stringify({
            status: 'success',
            message: 'In deleted successfully',
        }), {
            status: 200
        });
    } catch (error) {
        // response error
        return new Response(JSON.stringify({
            status: 'error',
            message: 'Failed to delete In',
            errors: error.message
        }), {
            status: 500
        });
    }
}
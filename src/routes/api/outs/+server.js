import {
    json
} from '@sveltejs/kit';
import connectToDatabase from '$lib/mongoose';
import Out from '$lib/models/Out';
import {
    z
} from 'zod';

const outSchema = z.object({
    no_surat_jalan: z.string().min(1, {
        message: "No Surat Jalan is required"
    }),
    tanggal: z.string().min(1, {
        message: "Tanggal is required"
    }),
    yang_mengeluarkan: z.string().min(1, {
        message: "Yang Mengeluarkan is required"
    }),
    yang_membawa: z.string().min(1, {
        message: "Yang Membawa is required"
    }),
    qty: z.number().int().positive().min(1, {
        message: "Qty is required"
    }),
    nama_barang: z.string().min(1, {
        message: "Nama Barang is required"
    })
});

/** @type {import('./$types').RequestHandler} */
//get outs
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
                yang_membawa: {
                    $regex: search,
                    $options: 'i'
                }
            },
            {
                yang_mengeluarkan: {
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
    const totalOuts = await Out.countDocuments();
    // Calculate total pages
    const totalPages = Math.ceil(totalOuts / limit);
    // Calculate the offset
    const offset = (page - 1) * limit;
    // Get outs with pagination
    const outs = await Out.find(querySearch).skip(offset).limit(limit);

    // Return response success
    return json({
        status: 'success',
        message: 'Outs read successfully',
        data: outs,
        pagination: {
            page,
            limit,
            totalPages,
            totalOuts
        }
    });
}

//post outs
export async function POST({
    request
}) {

    // Connect to database
    await connectToDatabase();

    // Get request body
    const body = await request.json();

    // Validate request body using Zod schema
    try {
        const validatedData = outSchema.parse(body);

        // Create new Out instance
        const newOut = new Out({
            no_surat_jalan: validatedData.no_surat_jalan,
            tanggal: validatedData.tanggal,
            yang_mengeluarkan: validatedData.yang_mengeluarkan,
            yang_membawa: validatedData.yang_membawa,
            qty: validatedData.qty,
            nama_barang: validatedData.nama_barang
        });

        // save data to database
        const savedOut = await newOut.save();

        // response success
        return json({
            status: 'success',
            message: 'Out created successfully',
            data: savedOut
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

//put outs
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
        const validatedData = outSchema.parse(body);

        // Update Out instance
        const updatedOut = await Out.findByIdAndUpdate(id, validatedData, {
            new: true
        });

        if (!updatedOut) {
            return new Response(JSON.stringify({
                status: 'error',
                message: 'Out not found'
            }), {
                status: 404,
            });
        }

        // response success
        return new Response(JSON.stringify({
            status: 'success',
            message: 'Out updated successfully',
            data: updatedOut
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

//delete outs
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
        // Delete Out instance
        const deletedOut = await Out.findByIdAndDelete(id);

        if (!deletedOut) {
            return new Response(JSON.stringify({
                status: 'error',
                message: 'Out not found'
            }), {
                status: 404
            });
        }

        // response success
        return new Response(JSON.stringify({
            status: 'success',
            message: 'Out deleted successfully',
        }), {
            status: 200
        });
    } catch (error) {
        // response error
        return new Response(JSON.stringify({
            status: 'error',
            message: 'Failed to delete Out',
            errors: error.message
        }), {
            status: 500
        });
    }
}
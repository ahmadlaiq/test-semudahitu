import {
    json
} from '@sveltejs/kit';
import connectToDatabase from '$lib/mongoose';
import ReturGudang from '$lib/models/ReturGudang';
import {
    z
} from 'zod';

const returGudangSchema = z.object({
    no_surat_jalan: z.string().min(1, {
        message: "No Surat Jalan is required"
    }),
    tanggal: z.string().min(1, {
        message: "Tanggal is required"
    }),
    yang_menerima: z.string().min(1, {
        message: "Yang Menerima is required"
    }),
    nama_barang: z.string().min(1, {
        message: "Nama Barang is required"
    }),
    qty: z.number().int().positive().min(1, {
        message: "Qty is required"
    }),
    yang_membawa: z.string().min(1, {
        message: "Yang Membawa is required"
    })

});

/** @type {import('./$types').RequestHandler} */
//get returGudangs
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
                yang_menerima: {
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
    const totalReturGudangs = await ReturGudang.countDocuments();
    // Calculate total pages
    const totalPages = Math.ceil(totalReturGudangs / limit);
    // Calculate the offset
    const offset = (page - 1) * limit;
    // Get returGudangs with pagination
    const returGudangs = await ReturGudang.find(querySearch).skip(offset).limit(limit);

    // Return response success
    return json({
        status: 'success',
        message: 'Retur Gudang read successfully',
        data: returGudangs,
        pagination: {
            page,
            limit,
            totalPages,
            totalReturGudangs
        }
    });
}

//post returGudangs
export async function POST({
    request
}) {

    // Connect to database
    await connectToDatabase();

    // Get request body
    const body = await request.json();

    // Validate request body using Zod schema
    try {
        const validatedData = returGudangSchema.parse(body);

        // Create new retuGudang instance
        const newReturGudang = new ReturGudang({
            no_surat_jalan: validatedData.no_surat_jalan,
            tanggal: validatedData.tanggal,
            yang_menerima: validatedData.yang_menerima,
            nama_barang: validatedData.nama_barang,
            qty: validatedData.qty,
            yang_membawa: validatedData.yang_membawa
        });

        // save data to database
        const savedReturGudang = await newReturGudang.save();

        // response success
        return json({
            status: 'success',
            message: 'Retur Gudang created successfully',
            data: savedReturGudang
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

//put returGudangs
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
        const validatedData = returGudangSchema.parse(body);

        // Update Retur Gudang instance
        const updatedReturGudang = await ReturGudang.findByIdAndUpdate(id, validatedData, {
            new: true
        });

        if (!updatedReturGudang) {
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
            message: 'Retur Gudang updated successfully',
            data: updatedReturGudang
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

//delete returGudangs
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
        // Delete Retur Gudang instance
        const deletedReturGudang = await ReturGudang.findByIdAndDelete(id);

        if (!deletedReturGudang) {
            return new Response(JSON.stringify({
                status: 'error',
                message: 'Retur Gudang not found'
            }), {
                status: 404
            });
        }

        // response success
        return new Response(JSON.stringify({
            status: 'success',
            message: 'Retur Gudang deleted successfully',
        }), {
            status: 200
        });
    } catch (error) {
        // response error
        return new Response(JSON.stringify({
            status: 'error',
            message: 'Failed to delete Retur Gudang',
            errors: error.message
        }), {
            status: 500
        });
    }
}
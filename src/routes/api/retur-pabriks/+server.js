import {
    json
} from '@sveltejs/kit';
import connectToDatabase from '$lib/mongoose';
import ReturPabrik from '$lib/models/ReturPabrik';
import {
    z
} from 'zod';

const returPabrikSchema = z.object({
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
    }),
    yang_mengeluarkan: z.string().min(1, {
        message: "Yang Mengeluarkan is required"
    })
});

/** @type {import('./$types').RequestHandler} */
//get returPabriks
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
    const totalReturPabriks = await ReturPabrik.countDocuments();
    // Calculate total pages
    const totalPages = Math.ceil(totalReturPabriks / limit);
    // Calculate the offset
    const offset = (page - 1) * limit;
    // Get ins with pagination
    const returPabriks = await ReturPabrik.find(querySearch).skip(offset).limit(limit);

    // Return response success
    return json({
        status: 'success',
        message: 'Retur Pabrik read successfully',
        data: returPabriks,
        pagination: {
            page,
            limit,
            totalPages,
            totalReturPabriks
        }
    });
}

//post returPabriks
export async function POST({
    request
}) {

    // Connect to database
    await connectToDatabase();

    // Get request body
    const body = await request.json();

    // Validate request body using Zod schema
    try {
        const validatedData = returPabrikSchema.parse(body);

        // Create new Retur Pabrik instance
        const newReturPabrik = new ReturPabrik({
            no_surat_jalan: validatedData.no_surat_jalan,
            tanggal: validatedData.tanggal,
            nama_supplier: validatedData.nama_supplier,
            nama_barang: validatedData.nama_barang,
            qty: validatedData.qty,
            yang_mengeluarkan: validatedData.yang_mengeluarkan
        });

        // save data to database
        const savedReturPabrik = await newReturPabrik.save();

        // response success
        return json({
            status: 'success',
            message: 'Retur Pabrik created successfully',
            data: savedReturPabrik
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
        const validatedData = returPabrikSchema.parse(body);

        // Update Retur Pabrik instance
        const updatedReturPabrik = await ReturPabrik.findByIdAndUpdate(id, validatedData, {
            new: true
        });

        if (!updatedReturPabrik) {
            return new Response(JSON.stringify({
                status: 'error',
                message: 'Retur Pabrik not found'
            }), {
                status: 404,
            });
        }

        // response success
        return new Response(JSON.stringify({
            status: 'success',
            message: 'Retur Pabrik updated successfully',
            data: updatedReturPabrik
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
        // Delete Retur Pabrik instance
        const deletedReturPabrik = await ReturPabrik.findByIdAndDelete(id);

        if (!deletedReturPabrik) {
            return new Response(JSON.stringify({
                status: 'error',
                message: 'Retur Pabrik not found'
            }), {
                status: 404
            });
        }

        // response success
        return new Response(JSON.stringify({
            status: 'success',
            message: 'Retur Pabrik deleted successfully',
        }), {
            status: 200
        });
    } catch (error) {
        // response error
        return new Response(JSON.stringify({
            status: 'error',
            message: 'Failed to delete Retur Pabrik',
            errors: error.message
        }), {
            status: 500
        });
    }
}
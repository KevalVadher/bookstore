const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
    name: { type: String, required: true },
    author: { type: String, required: true },
    publisher: { type: String },
    discount: { type: Number },
    price: { type: Number, required: true },
    released_date: { type: Date, required: true },
    binding: {
        type: String,
        enum : ['PAPERBACK','HARDCOVER', 'OTHER'],
        default: 'OTHER'
    },
    height: { type: String },
    width: { type: String },
    weight: { type: String },
    depth: { type: Number },
    isbn_13: { type: String, required: true },
    isbn_10: { type: String, required: true },
    bookLanguage: {
        type: String,
        enum : ['english','marathi', 'hindi'],
        required: true
    },
    returnable: { type: Boolean, required: true },
    img_url: { type: String, required: true }
},{
    collation: { locale: 'en_US', strength: 1 },
    usePushEach: true,
    timestamps : {createdAt: 'created_at', updatedAt: 'updated_at'}
}
)

bookSchema.options.toJSON = {
    transform: function(doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    }
};

bookSchema.statics.getBooksByIds = (bookIds = []) => {
    return Book.find({_id: { $in: bookIds }})
}

bookSchema.statics.getBooks = (binding, sortby, isCount=false, limit, skip) => {
    let query = Book.find()
    query.where({visibility: true})
    if(binding.length > 0) {
        query.where('binding').in(binding)
    }

    if(!isCount) {
        query.limit(limit)
        query.skip(skip)
    }

    if(sortby) {
        if(sortby === 'price_low_to_high')
            query.sort({price: 1})
        if(sortby === 'price_high_to_low')
            query.sort({price: -1})
        if(sortby === 'discount_low_to_high')
            query.sort({discount: 1})
        if(sortby === 'discount_high_to_low')
            query.sort({discount: -1})
    }

    if(isCount) {
        query.count()
    }

    return query
}

bookSchema.statics.search = (searchText, limit) => {

    const searchRegex = new RegExp(searchText, 'i')

    return Book.find({
        $or: [
            { "name":{ $regex : searchRegex } },
            { "author":{ $regex : searchRegex } },
            { "publisher":{ $regex : searchRegex } },
            { "isbn_13":{ $regex : searchRegex } }
        ]
    }).limit(limit)
}

const Book = mongoose.model('Book', bookSchema)

module.exports = Book
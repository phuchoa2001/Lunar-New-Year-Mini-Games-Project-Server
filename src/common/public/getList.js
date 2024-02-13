const getList = async (req, res, Schema, populates, fieldSearch) => {
  try {
    const { filter, sort, page, limit, operator, search, populate } = req.query;

    let query = Schema.find();
    let countQuery = Schema.find();

    // Thực hiện Lọc
    if (filter) {
      const filterObj = JSON.parse(filter);
      for (const key in filterObj) {
        if (Array.isArray(filterObj[key])) {
          // Sử dụng $in để lọc nhiều giá trị
          query.where(key).in(filterObj[key]);
          countQuery.where(key).in(filterObj[key]);
        } else {
          query.where(key).equals(filterObj[key]);
          countQuery.where(key).equals(filterObj[key]);
        }
      }
    }

    // Thực hiện Tìm kiếm toàn văn bản
    if (search) {
      query.where({
        $or: fieldSearch.map(item => ({ [item]: { $regex: new RegExp(`.*${search}.*`, "i") } }))
      });
      countQuery.where({
        $or: fieldSearch.map(item => ({ [item]: { $regex: new RegExp(`.*${search}.*`, "i") } }))
      });
    }

    // Mặc định sắp xếp theo created_at giảm dần
    query.sort({ createdAt: -1 });

    // Thực hiện Sắp xếp
    if (sort) {
      const sortObj = JSON.parse(sort);
      query.sort(sortObj);
    }

    // Thực hiện Phân trang
    const p = parseInt(page) || 1;
    const l = parseInt(limit) || 10;
    const skip = (p - 1) * l;
    const endIndex = p * l;

    query.skip(skip).limit(l);

    // Thực hiện Toán tử
    if (operator) {
      const operatorObj = JSON.parse(operator);
      query.where(operatorObj);
      countQuery.where(operatorObj);
    }

    // Thực hiện Quan hệ
    if (populate) {
      query.populate(populate);
    }

    // For hiện Quan hệ
    populates.forEach(item => {
      query.populate(item);
    })

    // Lấy danh sách sản phẩm và số lượng sản phẩm
    const products = await query.exec();
    const count = await countQuery.countDocuments().exec();

    res.json({
      success: true,
      data: products,
      page: p,
      limit: l,
      total: count
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = getList;
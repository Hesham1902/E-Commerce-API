class ApiFeatures {
  constructor(mongooseQuery, querString) {
    this.mongooseQuery = mongooseQuery;
    this.querString = querString;
  }

  filter() {
    //1- Filteration
    const queryObj = { ...this.querString };
    const excludeObj = ["page", "limit", "sort", "fields", "keyword"];
    //delete queryObj.sort; //Very Important (this because mognoose version 7 and later) solved by the above line
    excludeObj.forEach((i) => {
      delete queryObj[i];
    });
    // console.log(queryObj);
    // Apply filteration using [gte, gt, lte, lt]
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\bgte|gt|lte|lt\b/g, (match) => `$${match}`);

    this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStr));
    this.filteredQuery = JSON.parse(queryStr);
    return this;
  }

  sort() {
    //3- Sorting
    if (this.querString.sort) {
      const sortBy = this.querString.sort.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("createdAt");
    }
    return this;
  }

  limitFields() {
    //4- Fields limiting
    if (this.querString.fields) {
      const fields = this.querString.fields.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.select(fields);
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-__v");
    }
    return this;
  }

  search(modelName) {
    //5- Search
    if (this.querString.keyword) {
      let query = {};
      if (modelName === "Products") {
        query.$or = [
          { title: { $regex: this.querString.keyword, $options: "i" } },
          { description: { $regex: this.querString.keyword, $options: "i" } },
        ];
      } else {
        query = { name: { $regex: this.querString.keyword, $options: "i" } };
      }

      this.mongooseQuery = this.mongooseQuery.find(query);
      this.filteredQuery = query;
    }
    return this;
  }

  paginate(docsCount) {
    //2- Pagination
    const page = this.querString.page * 1 || 1;
    const limit = this.querString.limit * 1 || 50;
    const skip = (page - 1) * limit;
    const endIndex = page * limit;

    // Pagination Result
    const pagination = {};
    pagination.currentPage = page;
    pagination.limit = limit;
    pagination.numOfPages = Math.ceil(docsCount / limit);

    //Next Page
    if (endIndex < docsCount) {
      pagination.nextPage = page + 1;
    }
    if (skip > 0) {
      pagination.prevPage = page - 1;
    }
    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
    this.paginationResult = pagination;
    return this;
  }
}

module.exports = ApiFeatures;

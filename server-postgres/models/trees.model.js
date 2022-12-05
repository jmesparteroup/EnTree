const nanoid = require('nanoid');
class Trees {
  constructor(data) {
    this.treeId = nanoid(16);
    this.description = data?.description || "tree";
    this.createdAt = Date.now()
    this.location =`POINT(${data?.location})`
    this.userId = data?.userId;
  }
}
 
module.exports = Trees;
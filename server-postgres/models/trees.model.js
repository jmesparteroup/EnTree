const nanoid = require('nanoid');
class Trees {
  constructor(data) {
    this.treeId = nanoid(16);
    this.description = data?.description || "tree";
    this.createdAt = Date.now()
    this.location =`POINT(${parseFloat(data?.location.split(" ")[1])} ${parseFloat(data?.location.split(" ")[0])})`
    this.userId = data?.userId;
    this.longitude = parseFloat(data?.location.split(" ")[1]);
    this.latitude = parseFloat(data?.location.split(" ")[0]);
    this.flagged = data?.flagged;
  }
}
 
module.exports = Trees;
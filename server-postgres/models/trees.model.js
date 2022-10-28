class Trees {
  constructor(data) {
    this.description = data?.description 
    this.createdAt = Date.now()
    this.location =`POINT(${data?.location})`
    this.userId = data?.userId
  }
}

module.exports = Trees;
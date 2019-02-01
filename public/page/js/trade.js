new Vue({
	el: '#app',
	data: function () {
		return {
			list: [],
      activeNames: [],
      status: 'going',
      gridData: [],
      dialogTableVisible: false,
	    statusMap: {
	      going: '进行中',
	      bingo: '达到目标',
	      timeout: '时间到',
	      bought: '已经购买'
	    }
		}
	},
	computed: {
		tableData: function () {
			var ret = [];
			var obj = {};
			for (var i = 0; i < this.list.length; i++) {

				if (this.list[i].status !== this.status) {
					continue;
				}

				if (obj[this.list[i].product_id]) {
					obj[this.list[i].product_id].data.push(this.list[i])
				} else {
					obj[this.list[i].product_id] = {
						data: [this.list[i]],
						name: this.list[i].name
					}
				}
			}
			console.log(obj)
			for (var key in obj) {
				ret.push(obj[key])
			}
			console.log(ret)
			return ret;
		}
	},
	created: function () {
		// this.getPruductList();
		this.getTradeList();
		this.status = this.getQueryString('status') || 'going'
	},
	methods: { 
		getQueryString(name) { 
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
      var r = window.location.search.substr(1).match(reg); 
      if (r != null) return unescape(r[2]); 
      return null; 
    },
		handleDelete: function (index, row) {
			alert(index, row);
			this.getPruductList();
		},
		getPruductList: function () {
			var self = this;
			axios.get('/wxapp/product?all=1')
		  .then(function (response) {
		  	self.tableData = response.data.data.reverse();
		  })
		  .catch(function (error) {
		    console.log(error);
		  });
		},
		getTradeList: function () {
			var self = this;
			axios.get('/wxapp/trade?all=1')
		  .then(function (response) {
		  	console.log(response);
		  	for (var i = 0; i < response.data.data.length; i++) {
		  		response.data.data[i].createtime = new Date(response.data.data[i].createtime).toLocaleString();
		  	}
		  	self.list = response.data.data.reverse();
		  })
		  .catch(function (error) {
		    console.log(error);
		  });
		},
		changeStatus: function (status) {
			this.status = status;
			// this.activeNames = [];
		},
		check: function (id) {
			var self = this;
			axios.get('/wxapp/user?tradeid=' + id)
		  .then(function (response) {
		  	for (var i = 0; i < response.data.data.length; i++) {
		  		response.data.data[i].time = new Date(response.data.data[i].time).toLocaleString()
		  	}
		  	self.gridData = response.data.data.reverse();
		  	self.dialogTableVisible = true;
		  })
		  .catch(function (error) {
		    console.log(error);
		  });
		}
	}
})
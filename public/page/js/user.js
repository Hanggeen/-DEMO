new Vue({
	el: '#app',
	data: function () {
		return {
			tableData: []
		}
	},
	created: function () {
		this.getUserList();
	},
	methods: {
		handleDelete: function (index, row) {
			alert(index, row);
			this.getPruductList();
		},
		getUserList: function () {
			var self = this;
			axios.get('/wxapp/user?all=1')
		  .then(function (response) {
		  	for (var i = 0; i < response.data.data.length; i++) {
		  		response.data.data[i].createtime = new Date(response.data.data[i].createtime).toLocaleString() 
		  	}
		  	self.tableData = response.data.data.reverse();
		  })
		  .catch(function (error) {
		    console.log(error);
		  });
		}
	}
})
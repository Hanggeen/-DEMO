new Vue({
	el: '#app',
	data: function () {
		return {
			tableData: [],
			disableTableData: [],
			activeNames: ['0']
		}
	},
	created: function () {
		this.getPruductList();
		this.getDisablePruductList();
	},
	methods: {
		handleDelete: function (id) {
			var self = this;
    	axios.put('/wxapp/product', {
		    id: id,
		    able: 0
		  })
		  .then(function (response) {
		    if (response.data.status == 'ok') {
		    	alert('下架成功！');
					self.getPruductList();
					self.getDisablePruductList();
		    }
		  })
		  .catch(function (error) {
		    console.log(error);
		  });
		},
		handleRecovery: function (id) {
			var self = this;
    	axios.put('/wxapp/product', {
		    id: id,
		    able: 1
		  })
		  .then(function (response) {
		    if (response.data.status == 'ok') {
		    	alert('上架成功！');
					self.getPruductList();
					self.getDisablePruductList();
		    }
		  })
		  .catch(function (error) {
		    console.log(error);
		  });
		},
		getPruductList: function () {
			var self = this;
			axios.get('/wxapp/product?able=1')
		  .then(function (response) {
		  	self.tableData = response.data.data.reverse();
		  })
		  .catch(function (error) {
		    console.log(error);
		  });
		},
		getDisablePruductList: function () {
			var self = this;
			axios.get('/wxapp/product?able=0')
		  .then(function (response) {
		  	self.disableTableData = response.data.data.reverse();
		  })
		  .catch(function (error) {
		    console.log(error);
		  });
		},
	}
})
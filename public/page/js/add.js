new Vue({
	el: '#app',
	data: function () {
		return {
			form: {
        name: '',
				picture: "",
				introduce: "",
				price: null,
				floor_price: null,
				bargain_count: null,
				bargain_range: null,
				bargain_slope: null,
				term: null,
        able: 2,
				online: false,
				people: null,
				termday: null,
				up: '0'
			},
			rules: {
				name: [
				{ required: true, message: '请输入商品名称', trigger: 'change' }
				],
				price: [
				{ required: true, message: '请输入商品原价', trigger: 'change' }
				],
				introduce: [
				{ required: true, message: '请输入商品介绍', trigger: 'change' }
				],
				floor_price: [
				{ required: true, message: '请填写', trigger: 'change' }
				],
				bargain_count: [
				{ required: true, message: '请填写', trigger: 'change' }
				],
				bargain_range: [
				{ required: true, message: '请填写', trigger: 'change' }
				],
				bargain_slope: [
				{ required: true, message: '请填写', trigger: 'change' }
				],
				people: [
				{ required: true, message: '请填写', trigger: 'change' }
				],
				up: [
				{ required: true, message: '请填写', trigger: 'change' }
				],
				termday: [
				{ required: true, message: '请填写', trigger: 'change' }
				]
			}
		}
	},
	mounted: function () {
		var self = this;
		document.getElementById('uploadForm').onchange = function (e) {
			self.uploadCover(e)
		}
	},
	methods: {
		onSubmit: function (formName) {
			var self = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
        	self.form.price = Number(self.form.price);
        	self.form.floor_price = Number(self.form.floor_price);
        	self.form.bargain_range = Number(self.form.bargain_range);
        	self.form.bargain_slope = Number(self.form.bargain_slope);
        	self.form.people = Number(self.form.people);
        	self.form.termday = Number(self.form.termday);

        	self.form.able = self.form.online ? 1 : 0;
        	self.form.bargain_slope = self.form.up == '0' ? 0 - Number(self.form.bargain_slope) : Number(self.form.bargain_slope);
        	self.form.term = self.form.termday * 3600;
        	axios.post('/wxapp/product', {
				    name: self.form.name,
				    picture: self.form.picture,
				    price: self.form.price,
				    introduce: self.form.introduce,
				    floor_price: self.form.floor_price,
				    bargain_count: self.form.bargain_count,
				    bargain_slope: self.form.bargain_slope,
				    bargain_range: self.form.bargain_range,
				    term: self.form.term,
				    able: self.form.able
				  })
				  .then(function (response) {
				    console.log(response);
				    if (response.data.status == 'ok') {
				    	alert('提交成功！');
				    	window.location.reload();
				    }
				  })
				  .catch(function (error) {
				    console.log(error);
				  });
        }
      });
		},
		uploadCover: function(e){
			var self = this;
			var formData = new FormData($("#uploadForm")[0]);
			$.ajax({    
				url: '/wxapp/upload' ,  /*这是处理文件上传的servlet*/  
				type: 'POST',    
				data: formData,    
				async: false,    
				cache: false,    
				contentType: false,    
				processData: false,    
				success: function (result) {
					console.log(result)
					self.form.picture = result.data.path
				},    
				error: function (result) {    
					alert(result);    
				}    
			}); 
		}
	}
})
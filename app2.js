var store = {
	save(key,value){
		localStorage.setItem(key,JSON.stringify(value))
	},
	fetch(key){
		return JSON.parse(localStorage.getItem(key)) || [];
	}
};
var list = store.fetch("dataList");
var filter = {
	all:function(list){
		return list;
	},
	unfinished:function(list){
		return list.filter(item=>{
			return !item.isChecked;
		})
	},
	finished:function(list){
		return list.filter(item=>{
			return item.isChecked;
		})
	}
};
var vm = new Vue({
	el:".main",
	data:{
		list,
		val:"",
		editor:"", 
		beforeTitle:"",  
		hashChange:"all" 
	},
	watch:{
		list:{  
			handler:function(){
				store.save("dataList",this.list);
			},
			deep:true
		}
	},
	methods:{
		addTodo(){
			if(this.val){
				this.list.push({
					"title":this.val,
					isChecked:false
				})
			}
			this.val = "";
		},
		removeTodo(index){ 
			this.$delete(this.list,index);
		},
		reEdit(item){  
			this.beforeTitle = item.title;
			this.editor = item;
		},
		changeTitle(item){ 
			
			this.editor = "";
		},
		cancleChange(item){
			item.title = this.beforeTitle;
			this.editor = "";
		}
	},
	computed:{
		unCompeleteNum(){
			return this.list.filter(item=>{
				return !item.isChecked
			}).length
		},
		filteredList(){
			return filter[this.hashChange]?filter[this.hashChange](this.list):list;
		}
	},
	directives:{
		"focus":{
			update(el,binding){
				if(binding.value){
					el.focus();
				}
			}
		}
	}
});

function getHash(){
	var hash = window.location.hash.slice(1);
	vm.hashChange = hash;
};
getHash();
window.addEventListener("hashchange",getHash)
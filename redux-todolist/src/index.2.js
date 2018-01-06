import React from 'react';
import ReactDom from 'react-dom';
import {createStore} from 'redux';

//创建state`
const defaultState={
  list:['qq','bmw']
};

//创建reducer   (必须是纯函数，必须要有返回值,默认接收state,和组件传入的action)
const reducer = (state=defaultState,action)=>{
  console.log('reducer');
  let {type,payload}=action;
  console.log(type,payload);
  switch(type){
    case 'ADD':
      //处理业务逻辑，返回新state(复制，copy对象,[...xxx],Object.asigin)
      //state.list.push(payload) ×  直接修改
      return Object.assign({},state,{
        list:state.list.concat(payload)
      });
      // return 新state;
      break;
    default:
      return state;
  }
};


//1.创建store对象,把reducer和state传入
const store = createStore(reducer,defaultState);


class App extends React.Component {
  constructor(props){
    super(props);
    this.state={
      list:[]
    };
    this.add=this.add.bind(this);
    console.log(this.props.store.getState()); //只跑一次
  }
  componentDidMount(){
    this.props.store.subscribe(()=>{
      console.log('更新后的',this.props.store.getState());
    })
  }
  add(){
    //发送action
    this.props.store.dispatch({
      type:'ADD',
      payload:this.refs.ipt1.value
    });
  }
  render() {
    let list=this.state.list.map((item,index)=>{
      return (
        <li key={index}>{item}</li>
      );
    });
    return (
      <div>
        <input type="text" ref="ipt1"/>
        <input
          type="button"
          value="添加"
          onClick={this.add}
        />
        {list}
      </div>
    );
  }
}
ReactDom.render(
  <App store={store}/>,
  document.querySelector('#app')
);

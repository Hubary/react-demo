import React from 'react';
import ReactDom from 'react-dom';
import {createStore} from 'redux';

//创建state
const defaultState={
  list:['qq','bmw','k5'],
  sending:false
};

const reducer = (state=defaultState,action)=>{
  let {type,payload}=action;
  switch(type){
    case 'ADD':
      return Object.assign({},state,{
        list:state.list.concat(payload)
      });
      break;
    case 'START_LOADING':
      return Object.assign({},state,{
        sending:true
      });
    case 'STOP_LOADING':
      return Object.assign({},state,{
        sending:false
      });
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
      list:[],
      sending:false
    };
    this.add=this.add.bind(this);
    this.async=this.async.bind(this);

    console.log(this.props.store.getState()); //只跑一次

  }
  componentDidMount(){
    this.setState({
      list:this.props.store.getState().list,
      sending:this.props.store.getState().sending
    });
    this.props.store.subscribe(()=>{
      console.log('更新后的',this.props.store.getState());
      this.setState({
        list:this.props.store.getState().list,
        sending:this.props.store.getState().sending
      })
    });
  }
  async(){
    //模拟异步操作
    this.props.store.dispatch({
      type:'START_LOADING'
    });
    setTimeout(()=>{
      this.props.store.dispatch({
        type:'ADD',
        payload:this.refs.ipt1.value
      });
      this.props.store.dispatch({
        type:'STOP_LOADING'
      });
    },1000);
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
        <input
          type="button"
          value="异步添加"
          onClick={this.async}
        />
        {this.state.sending?'发送中...':undefined}
        {list}
      </div>
    );
  }
}
ReactDom.render(
  <App store={store}/>,
  document.querySelector('#app')
);

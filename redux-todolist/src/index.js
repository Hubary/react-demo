import React from "react";
import ReactDom from "react-dom";
import { createStore } from "redux";

//创建state
const defaultState = {
  listdata: ["redux", "study"]
};


//创建reducer (必须是纯函数,必须要有返回值,默认接收state,和组件传入的action)
const reducer = (state = defaultState, action) => {
  console.log("reducer");
  let { type, payload } = action;
  switch (type) {
    case "ADD":
      return Object.assign({}, state, {
        listdata: state.listdata.concat(payload)
      });
      break;
    case "START":
      return Object.assign({},state, {
        sending: true
      })
      break;
    case "STOP":
      return Object.assign({}, state, {
        sending: false
      })
      break;
    default:
      return state;
  }
}

//创建store对象,把reducer和state传进去
const store = createStore(reducer, defaultState);

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      listdata: [],
      sending: false
    }
    this.add = this.add.bind(this);
    console.log(this.props.store.getState());
    this.async = this.async.bind(this);
  }

  componentDidMount() {
    this.setState({
      listdata: this.props.store.getState().listdata,
      sending: this.props.store.getState().sending
    })
    this.props.store.subscribe(() => {
      this.setState({
        listdata: this.props.store.getState().listdata,
        sending: this.props.store.getState().sending
      })
    })
  }

  //模拟异步操作
  async() {
    this.props.store.dispatch({
      type: "START"  //发送
    })
    var _this = this;
    setTimeout(() => {
      _this.add();
      this.props.store.dispatch({
        type: "STOP"
      })
    }, 2000)
  }

  add() {
    let reg = /^\s*$/;
    if (reg.test(this.refs.ipt1.value) == false) {
      this.props.store.dispatch({
        type: "ADD",
        payload: this.refs.ipt1.value
      })
      console.log('....')
    }
  }

  render() {
    let listdata = this.state.listdata.map((item, index) => {
      return (
        <li key={index}>{item}</li>
      );
    })

    let a = this.state.sending ? "发送中...." : "模拟异步加载";

    return (
      <div>
        <div className="input">
          <input type="text" ref='ipt1' defaultValue="我爱上你了!" />
          <input type="button" value="添加" onClick={this.add} />
          <input type="button" value={a} onClick={this.async} />
        </div>
        <ul>
          {listdata}
        </ul>
      </div>
    )
  }

}

//DOM渲染
ReactDom.render(
  <App store={store} />,
  document.querySelector("#app")
);
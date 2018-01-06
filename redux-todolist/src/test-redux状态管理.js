
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
  console.log(type, payload);
  switch (type) {
    case "ADDITEM":
      //处理业务逻辑,返回新的state(复制,copy对象,[...xxx],Object.assign)
      return Object.assign({}, state, {
        listdata: state.listdata.concat(payload)
      });
      break;
    case "START":
      return Object.assign({}, state, {
        sending: true
      });
      breack;
    case "STOP_LOADING":
      return Object.assign({}, state, {
        sending: false
      });
    default:
      return state;
  }
};

//1.创建store对象,把reducer和state传入
const store = createStore(reducer, defaultState);


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listdata: [],
      sending: false

    };
    this.addItem = this.addItem.bind(this)
    console.log(this.props.store.getState()); //只跑一次
    this.async = this.async.bind(this);

  };
  componentDidMount() {
    this.setState({
      listdata: this.props.store.getState().listdata,
      sending: this.props.store.getState().sending,
    })
    console.log("更新前的", this.props.store.getState());
    this.props.store.subscribe(() => {
      console.log("更新后的", this.props.store.getState());
      this.setState({
        listdata: this.props.store.getState().listdata,
        sending: this.props.store.getState().sending,
      })
    })
  }
  async() {
    //模拟异步操作
    this.props.store.dispatch({
      type: "START",
    })
    setTimeout(() => {
      this.props.store.dispatch({
        type: 'ADDITEM',
        payload: this.refs.ipt1.value
      });
      this.props.store.dispatch({
        type: 'STOP_LOADING'
      });
    }, 2000)
  }
  addItem() {
    //发送action
    let reg = /^\s*$/;
    if (reg.test(this.refs.ipt1.value) == false) {
      this.props.store.dispatch({
        type: "ADDITEM",
        payload: this.refs.ipt1.value
      })
    }

  }

  render() {
    let listdata = this.state.listdata.map((item, index) => {
      return (
        <li key={index}>{item}</li>
      );
    });
    let a = this.state.sending ? '发送中...' : "模拟异步加载";

    return (
      <div>
        <div className="input">
          <input type="text" ref="ipt1" defaultValue="我真的很爱你!" />
          <input
            type="button"
            value="添加"
            onClick={this.addItem}
          />
          <input
            type="button"
            value={a}
            onClick={this.async}
          />
        </div>
        <ul>
          {listdata}
        </ul>
      </div>
    );
  }
}


//DOM渲染
ReactDom.render(
  <App store={store} />,
  document.querySelector('#app')
);
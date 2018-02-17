//app.js
import pop from './common/js/toast'
import objectAssign from "./common/js/object-assign"
import $https from './common/js/https'
import api from './config/api'
App({
	onLaunch: function () {
		// 展示本地存储能力
		var logs = wx.getStorageSync('logs') || [];
		logs.unshift(Date.now());
		wx.setStorageSync('logs', logs);

		// 登录
		wx.login({
			success: res => {
				// 发送 res.code 到后台换取 openId, sessionKey, unionId
				const url = api.test;
				const param = {};
				const configs = {
					resFn: (res, callback, configs) => {
						callback(res.data, configs)
					}
				};
				const callback = (data) => {
					this.globalData.motto = data.data;
					this.productTest();
				};
				try {
					$https.get(url, param, callback, configs);
				}
				catch(err) {
					pop.toast.err(err.errMsg)
				}
			}
		});
		// 获取用户信息
		wx.getSetting({
			success: res => {
				if (res.authSetting['scope.userInfo']) {
					// 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
					wx.getUserInfo({
						success: res => {
							// 可以将 res 发送给后台解码出 unionId
							this.globalData.userInfo = res.userInfo;

							// 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
							// 所以此处加入 callback 以防止这种情况
							if (this.userInfoReadyCallback) {
								this.userInfoReadyCallback(res)
							}
						}
					});
				}
			}
		})
	},
    productTest() {
		console.log('product test');
		const url = api.productTest;
		const param = {};
		const callback = (data) => {
			console.log(data);
		};
		$https.get(url, param, callback);
	},
	globalData: {
		userInfo: null,
		// 变量 || 对象
		motto: '',
		api: api,
		// 方法
		// 双向绑定数据方法
        duplexBind(e) {
            let obj = objectAssign({}, this.data);
            const model = e.currentTarget.dataset.model.split('.');
            setValue(this.data, model, e.detail.value);
            // 如需强制设置data，需要在html中添加属性data-deep
            if (e.currentTarget.dataset.deep) {
                setValue(obj, model, e.detail.value);
                this.setData(obj);
            }
        },
		// 弹窗方法
		pop: pop,
		// 合并对象方法
		objectAssign: objectAssign,
		// 请求方法
		$https: $https,
	},
});
// 未知深度递归赋值
function setValue(obj, arr, val) {
    let length = arr.length;
    console.log(obj, arr);
    if (length != 1) {
        setValue(obj[arr[0]], arr.slice(1), val)
    } else {
        obj[arr[0]] = val;
    }
}
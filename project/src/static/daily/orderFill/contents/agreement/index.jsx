/**
 * @description 预订条款
 * @author Kepeng
 */
import React, {Component} from "react";
require('./sass/index.scss');
import {Icon} from 'local-Antd';


class Agreement extends Component {

	constructor(props, context) {
		super(props, context);
		this.state = {
			show: this.props.show
		}
		this.agentName = window.__AGENT_INFO.sysName
	}
	componentWillReceiveProps(nextProps) {
	  this.setState({
	    show : nextProps.show
	  });
	}

	hidePop() {
	  // this.setState({
	  //   show : false
	  // });
	  this.props.changeHide && this.props.changeHide();
	}

	render(){
		if(this.state.show){
			return(
				<div className="bookPop">
					<div className="mask"></div>
					<div className="bookWrap">
						<div className="head">预订条款<Icon className="close" type="close" onClick={this.hidePop.bind(this)}/></div>
						<div className="cont">
							<div className="modal-body article-wrap" style={{overflow: 'auto'}}>
				                <p>
				                    {this.agentName}上刊载的所有内容，包括但不限于文字报导、图片、图表、标志、标识、广告、商标、域名、程序、版面设计、专栏目录与名称、内容分类标准以及为注册用户提供的任何或所有信息，均受《中华人民共和国著作权法》、《中华人民共和国商标法》、《中华人民共和国专利法》及适用之国际公约中有关著作权、商标权、专利权及／或其它财产所有权法律的保护，为北京纯粹旅行有限公司及相关权利人专属所有或持有。
				                </p>
				                <p>使用者将{this.agentName}提供的内容与服务用于非商业用途、非盈利、非广告目的而纯作个人消费时，应遵守著作权法以及其他相关法律的规定，不得侵犯搜捕及／或相关权利人的权利。</p>
				                <p>使用者将{this.agentName}提供的内容与服务用于商业、盈利、广告性目的时，需征得{this.agentName}及／或相关权利人的书面特别授权，注明作者及文章出处“{this.agentName}”，并按有关国际公约和中华人民共和国法律的有关规定向相关权利人支付版税。</p>
				                <p>未经{this.agentName}的明确书面特别授权，任何人不得变更、发行、播送、转载、复制、重制、改动、散布、表演、展示或利用{this.agentName}的局部或全部的内容或服务或在非{this.agentName}所属的服务器上作镜像，否则以侵权论，依法追究法律责任。</p>
				                <h5 className="article-title"><strong>隐私保护</strong></h5>
				                <p>
				                    {this.agentName}承认、尊重并保护注册用户向{this.agentName}提供的任何或所有个人信息以及注册用户根据中华人民共和国民事法律规定享有的隐私权。当注册用户使用{this.agentName}的各项服务时，{this.agentName}将根据本网站其时公布并不断修正之保护个人信息及隐私权政策处理注册用户提供的各项个人资料及其中所含的各项私密性信息。</p>
				                <p>
				                    通常情况下,任何人都能在匿名状态下访问{this.agentName}并获取信息。网站上某些板块需要注册才能进入，这类注册也只要求注册用户提供一个电子邮件地址和一些诸如注册用户的工作、职务一类的基本信息。然而，网站有时也会要求注册用户提供更多的信息。{this.agentName}对注册用户个人资料的收集，包括姓名、电子信箱、性别、电话、职业等。搜捕这样做是为了使{this.agentName}更好地理解注册用户的需求，以便向注册用户提供有效的服务。{this.agentName}认为注册用户提供的信息越详尽越能帮助网站为注册用户提供更好的服务。当您注册成为{this.agentName}注册用户或参加网上活动或进入论坛时所自愿填写的个人资料，注册用户愿意提供的资料越多，本网站越能提供注册用户个人化的服务。同时，我们认为：注册用户向我们提供个人信息是基于对我们的信任,
				                    相信我们会以负责的态度对待注册用户的个人信息。我们也正是基于这样的认识，制订并公布保护个人信息与隐私权政策。
				                </p>
				                <p>
				                    {this.agentName}采取严格且合适的步骤保护注册用户的注册资料和注册用户的隐私。每当注册用户提供给搜捕敏感信息时（如完成特定服务需求注册时所必须的类似一卡通信用号码等），我们采取合理的步骤保护注册用户的敏感信息和合理的安全手段保护已存储的个人信息。我们访问这些个人信息权限仅限于需要进行此类访问以完成其工作和向注册用户提供服务的人员。</p>
				                <p>
				                    在未得到注册用户的许可之前，我们不会把注册用户的任何个人信息提供给其它公司或个人。但是,如果注册用户要求我们提供特定服务以及注册用户支援服务或把一些礼品或物品送交给注册用户时，我们则需要把注册用户的姓名和地址提供给第三者如运输公司。这些公司会与我们订立协议承诺他们不会把这些信息用于其它目的，也不会向其他任何人泄漏这些信息。在进行某些网上广告或网上活动时如网上促销等，如果注册用户的个人资料将有可能被第三者共享时，本网站会事先向注册用户提供如何拒绝这项服务的说明。如果注册用户不愿意个人注册资料被共享，可以选择不使用特定服务或不参与特定促销活动或竞赛等。</p>
				                <p>除非本条款另有表述，我们收集注册用户个人资料仅限于{this.agentName}内部用作以下用途：</p>
				                <span>(１)增加对注册用户的了解；</span>
				                <span>(２)向注册用户提供更佳的个人化服务；</span>
				                <span>(３)网上抽奖或赠送礼品；</span>
				                <span>(４)目标导向性广告及资讯；</span>
				                <span>(５)公布本站新推出的产品及服务；</span>
				                <span>(６)本网站认为注册用户会感兴趣的其他资讯与服务；</span>
				                <span>(７)统计与分析。本网站所有优质服务的提供是基于注册用户所提供的个人信息资料具有的准确性和时效性。</span>
				                <p>{this.agentName}得在下列情况下向有关人士提供注册用户个人资料：</p>
				                <span>(１)符合法律要求并经法定程序；</span>
				                <span>(２)在紧急情况下，为了保护本站及其注册用户之个人或公众安全，但本站应按强制法律规范或强制法律程序进行。</span>
				                <p>注册用户在本站的论坛或留言板上自愿透露的个人资料可能经由网络传播被其他人士收集和使用，此类行为非网站所能控制，若造成注册用户的任何困扰，本站不对此负责。{this.agentName}将会提供第三者网站的链接。由于本站不能控制这些网站,
				                    所以我们建议注册用户在通过链接访问这些网站时细阅这些第三者网站的个人信息保密制度。</p>
				                <p>
				                    本站欢迎注册用户对在此公布的保护个人信息与隐私权政策给予评论并提出质疑。我们将致力于保护注册用户的个人信息和隐私权，并尽全力保证这些信息的安全。由于因特网上的技术发展突飞猛进，本站会随时更新保护个人信息与隐私权政策。所有的修订将在本站上公布。如有与本政策有关的所有评论和质疑，请即发往service@yundijie.com邮箱。</p>
				                <h5 className="article-title"><strong>网上安全声明</strong></h5>
				                <p>
				                    {this.agentName}公布本法律声明旨在推行公开、知情和同意的原则,并在此基础上建立互联网用户在网络上的信任和信心。由于本站旨在向注册用户展示保守信息秘密和提供安全稳定的网络环境的承诺，因此，我们希望通过披露本站上安全政策和保护个人信息与稳私权政策的方式遵从互联网行业通行国际惯例，并接受会员和公众的监督。</p>
				                <p>我们欢迎并奖励任何人对本网技术安全性通过合适的程序提出的合理建议，反对任何人以任何非法、不当或不道德的方法侵入他人网络的黑客行为。本站将在合适的时机通过参加或建立保守信息秘密以及网络安全的计划。</p>
				                <h5 className="article-title"><strong>免责声明</strong></h5>
				                <p>除{this.agentName}注明之服务条款外，任何因使用本站或与本站连接的任何其他网站或网页而引致的意外、疏忽、合约毁坏、诽谤、感染电脑病毒、版权或其他知识产权纠纷及其造成的损失，{this.agentName}概不负责，不承担任何法律责任。
				                </p>
				                <p>{this.agentName}所提供的所有内容是按当时的现状提供的，在公布时已尽谨慎义务。若遇有任何内容更改，本站无须另行通知，也不对任何人士获取的上述内容的准确性、有效性、合时性或完整性作任何保证。</p>
				                <p>
				                    除非本站公布的保护个人信息与隐私权的政策另有声明，注册用户转发或发送到本网任何站点上的任何内容、信息或通信信息被认为是非机密和非私有的，我们没有任何通讯保密方面的义务。{this.agentName}和我们的指定公司可以为任何商业或非商业的目的，免费拷贝、透露、分发、合并或使用通讯信息和所有的数据、图形、声音、文本以及其他资料。本站禁止注册用户发送或转送任何非法的具有威胁、中伤、诽谤、淫秽、色情内容或其他违反法律的内容。对于这些内容，注册用户应承担任何因此有可能产生的民事侵权或刑事法律责任，该等法律责任与{this.agentName}无关。</p>
				                <p>任何因{this.agentName}提供内容或服务或因内容和服务本身或因本站公布的规则、政策、指引、声明、条件与条款、协议的任何或所有条款与{this.agentName}之法律主体桂林国旅南宁分社发生争议而提出的申诉适用中华人民共和国实体法律规范（不包括冲突规范）。</p>
				                <p>本法律声明与注册用户协议如有冲突，以本法律声明为准。注册用户协议的特别条件与条款，应与本法律声明一起理解与使用。本法律声明的任何或所有条款均是注册用户协议不可分割的组成部分。</p>
				            </div>
						</div>
					</div>
				</div>
			)
		}
		return null;

	}
}


export default Agreement;
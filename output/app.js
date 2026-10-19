(()=>{
 const dashboard=document.getElementById('dashboard');
 // Only the central room illustration scales; navigation and panels retain their pixel sizes.
 const workspace=document.getElementById('workspace');
 const scene=document.getElementById('room-scene');
 const panels=document.getElementById('panels');
 const center=document.getElementById('center-panel');
 const background=scene.querySelector('[data-node-id="64:843"]');
 scene.prepend(background);

 const layoutScene=()=>{
  const width=center.clientWidth;
  center.style.setProperty('--room-nav-height',width<577?'46px':'38px');
  const available=panels.clientHeight-center.offsetHeight+134;
  const compact=matchMedia('(max-width: 1100px)').matches;
  const scale=Math.max(0,Math.min(width/835,compact?0.65:available/552,1));
  scene.style.left=(center.offsetLeft+(width-835)/2+panels.offsetLeft)+'px';
  scene.style.top=(compact?134:134*(1-scale))+'px';
  scene.style.transform=`scale(${scale})`;
 };
 const observer=new ResizeObserver(layoutScene);
 observer.observe(workspace);observer.observe(center);observer.observe(panels);
 layoutScene();
 // Native overflow provides wheel, touch, keyboard and draggable scrollbar support.
 const dialog=document.createElement('dialog');dialog.className='detail-dialog';dialog.innerHTML='<form method="dialog"><button class="close" aria-label="关闭">×</button></form><h2></h2><div class="details"></div>';document.body.append(dialog);
 function show(title,html){dialog.querySelector('h2').textContent=title;dialog.querySelector('.details').innerHTML=html;dialog.showModal()}
 dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
 const bind=(el,label,fn)=>{el.tabIndex=0;el.role='button';el.setAttribute('aria-label',label);el.style.cursor='pointer';el.addEventListener('click',fn);el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();fn(e)}})};
 document.querySelectorAll('[data-name="card_tip"]').forEach(el=>bind(el,'查看 '+el.innerText.split('\n')[0],()=>show(el.innerText.split('\n')[0]+' · 温湿度传感器',`<p>${el.innerText.replaceAll('\n','<br>')}</p><p class="subtle">通讯状态：在线 · 数据为设计示例</p>`)));
 document.querySelectorAll('[data-name="设备_tip"]').forEach((el,i)=>bind(el,'查看设备详情',()=>show(['空调设备','空调设备','环境传感器','门禁设备','配电设备'][i]||'设备详情','<p>机房 1 · 设备在线</p><p class="subtle">当前页面使用 Figma 示例数据，尚未连接实时监控服务。</p>')));
 document.querySelectorAll('#rooms > div > div').forEach((el,i)=>bind(el,'切换机房 '+(i+1),()=>{if(i===0)return;show('机房 '+(i+1),'<p>源设计提供的是机房 1 页面。</p><p class="subtle">该机房暂无接入数据。</p>')}));
 document.querySelectorAll('#categories > div > div').forEach((el,i)=>{if(i!==2)bind(el,el.innerText,()=>show(el.innerText,'<p>该区域暂未接入监控数据。</p>'))});
 document.querySelectorAll('#center-panel [data-node-id]').forEach(el=>{if(el.children.length===0&&el.textContent.trim()==='未确认')bind(el,'确认此告警',()=>{el.textContent='已确认';el.style.color='#00ff7b';el.setAttribute('aria-label','告警已确认')})});
 const actions={'语言':()=>show('语言','<p>当前语言：简体中文</p>'),'主题':()=>{document.body.classList.toggle('brighter')},'静音':el=>{const t=el.querySelector('p');t.textContent=t.textContent==='静音'?'取消静音':'静音';el.setAttribute('aria-pressed',t.textContent==='取消静音')},'告警':()=>document.querySelector('#center-panel').animate([{filter:'brightness(1.8)'},{filter:'brightness(1)'}],{duration:900}),'设置':()=>show('显示设置','<label><input type="checkbox" id="clock-toggle" checked> 显示时钟</label><p class="subtle">当前为本地演示页面。</p>'),'全屏':async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen()}catch{show('全屏','<p>请使用浏览器全屏功能（F11）。</p>')}}};
 document.querySelectorAll('header [data-name="btn"]').forEach(el=>{let label=el.innerText.trim();if(actions[label])bind(el,label,()=>actions[label](el))});
 document.addEventListener('change',e=>{if(e.target.id==='clock-toggle')document.querySelector('[data-node-id="63:79"]').style.visibility=e.target.checked?'visible':'hidden'});
 const collapse=document.querySelector('[data-name="Collapse/Expand_button"]');if(collapse)bind(collapse,'收起或展开导航',()=>{const collapsed=document.querySelector('aside').classList.toggle('collapsed');dashboard.classList.toggle('is-collapsed',collapsed);collapse.setAttribute('aria-expanded',String(!collapsed))});
 document.querySelectorAll('aside > [data-name="left"] > div:not([data-name])').forEach((el,i)=>{if(i>0)bind(el,el.innerText,()=>show(el.innerText,'<p>该功能暂未连接后台服务。</p>'))});
 const clock=document.querySelector('[data-node-id="63:79"]');function tick(){const d=new Date();const parts=new Intl.DateTimeFormat('zh-CN',{timeZone:'Asia/Shanghai',month:'2-digit',day:'2-digit',weekday:'short',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false}).formatToParts(d);const get=t=>parts.find(p=>p.type===t)?.value;clock.innerHTML=`<p>${get('month')}.${get('day')} ${get('weekday')}</p><p>${get('hour')}：${get('minute')}：${get('second')}</p>`}tick();setInterval(tick,1000);
})();

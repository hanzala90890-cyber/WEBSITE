/* ==========================================
   HERO3D.JS - Three.js 3D Hero Scene
   ========================================== */

function initHero3D(){
  const el=document.getElementById('hero3d');
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(45, el.clientWidth/el.clientHeight, 0.1, 100);
  camera.position.set(0,0.4,6);
  const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
  renderer.setSize(el.clientWidth, el.clientHeight);
  el.appendChild(renderer.domElement);

  const key=new THREE.PointLight(0xf2a93b, 2.2, 20);
  key.position.set(3,4,4);
  scene.add(key);
  const fill=new THREE.PointLight(0xffffff, 0.6, 20);
  fill.position.set(-3,-2,3);
  scene.add(fill);
  scene.add(new THREE.AmbientLight(0x333333));

  const group=new THREE.Group();
  const bodyMat=new THREE.MeshStandardMaterial({color:0x151515, metalness:0.7, roughness:0.35});
  const goldMat=new THREE.MeshStandardMaterial({color:0xf2a93b, metalness:0.8, roughness:0.25});

  const body=new THREE.Mesh(new THREE.CylinderGeometry(0.55,0.6,2.6,32), bodyMat);
  group.add(body);
  const ring1=new THREE.Mesh(new THREE.CylinderGeometry(0.62,0.62,0.08,32), goldMat);
  ring1.position.y=0.9;
  group.add(ring1);
  const ring2=new THREE.Mesh(new THREE.CylinderGeometry(0.62,0.62,0.08,32), goldMat);
  ring2.position.y=-0.9;
  group.add(ring2);
  const tank=new THREE.Mesh(new THREE.CylinderGeometry(0.42,0.42,1.1,32), new THREE.MeshStandardMaterial({color:0x2a2210, metalness:0.3, roughness:0.15, transparent:true, opacity:0.85}));
  tank.position.y=1.85;
  group.add(tank);
  const cap=new THREE.Mesh(new THREE.CylinderGeometry(0.34,0.4,0.55,32), bodyMat);
  cap.position.y=2.7;
  group.add(cap);
  const tip=new THREE.Mesh(new THREE.CylinderGeometry(0.16,0.16,0.3,24), goldMat);
  tip.position.y=3.05;
  group.add(tip);
  group.rotation.z = Math.PI*0.06;
  scene.add(group);

  const smokeGeo=new THREE.SphereGeometry(0.09,10,10);
  const smokeMat=new THREE.MeshStandardMaterial({color:0xffffff, transparent:true, opacity:0.35, roughness:1});
  const smoke=[];
  for(let i=0;i<26;i++){
    const m=new THREE.Mesh(smokeGeo, smokeMat.clone());
    m.position.set((Math.random()-0.5)*1.2, 3.2+Math.random()*2.2, (Math.random()-0.5)*1.2);
    m.scale.setScalar(0.5+Math.random()*1.3);
    m.userData.speed=0.15+Math.random()*0.25;
    m.userData.drift=(Math.random()-0.5)*0.4;
    smoke.push(m);
    scene.add(m);
  }

  function animate(){
    requestAnimationFrame(animate);
    group.rotation.y += 0.006;
    smoke.forEach(m=>{
      m.position.y += m.userData.speed*0.02;
      m.position.x += m.userData.drift*0.01;
      if(m.position.y>5.6){
        m.position.y=3.2;
        m.position.x=(Math.random()-0.5)*1.2;
      }
    });
    renderer.render(scene,camera);
  }
  animate();

  window.addEventListener('resize',()=>{
    camera.aspect=el.clientWidth/el.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(el.clientWidth, el.clientHeight);
  });
}

const progress=document.getElementById('progress');
window.addEventListener('scroll',()=>{const d=document.documentElement;const max=d.scrollHeight-d.clientHeight;progress.style.width=`${max?d.scrollTop/max*100:0}%`});
const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
const toast=document.getElementById('toast');
function showToast(text){toast.textContent=text;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),3500)}
document.getElementById('leadForm').addEventListener('submit',e=>{
  e.preventDefault();
  const data=new FormData(e.currentTarget);
  const text=`Tôi muốn tư vấn khóa học Le'Kati.%0A%0AHọ tên: ${encodeURIComponent(data.get('name'))}%0ASĐT: ${encodeURIComponent(data.get('phone'))}%0ALĩnh vực: ${encodeURIComponent(data.get('field'))}%0AMục tiêu: ${encodeURIComponent(data.get('goal')||'Chưa cung cấp')}`;
  showToast('Đang mở Messenger để gửi thông tin tư vấn…');
  setTimeout(()=>window.open(`https://m.me/myleBDSvinhomes?text=${text}`,'_blank','noopener'),500);
});

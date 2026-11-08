/* ==========================================================
   Armazenamento: usa o Firestore (Firebase) quando configurado
   e, se não estiver, guarda tudo no localStorage do navegador.
   Coleções: comentarios, avaliacoes, inscricoes.
   ========================================================== */
import { firebaseConfig } from './firebase-config.js';

const SDK = 'https://www.gstatic.com/firebasejs/10.12.2';
const K = { comments: 'cr_comments', ratings: 'cr_ratings', enroll: 'cr_enroll', liked: 'cr_liked', rated: 'cr_rated', jobs: 'cr_jobs' };

const read = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? d; } catch { return d; } };
const write = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* armazenamento bloqueado */ } };

let fb = null;
export let mode = 'local';

const listeners = { comments: new Set(), ratings: new Set() };
const notify = (name) => {
  const data = read(K[name], []);
  listeners[name].forEach(cb => cb(data));
};

/** Tenta conectar ao Firebase. Sem configuração válida, segue em modo local. */
export async function init() {
  const ok = firebaseConfig && firebaseConfig.apiKey && !String(firebaseConfig.apiKey).startsWith('COLE');
  if (!ok) return mode;
  try {
    const [{ initializeApp }, fs] = await Promise.all([
      import(`${SDK}/firebase-app.js`),
      import(`${SDK}/firebase-firestore.js`)
    ]);
    const app = initializeApp(firebaseConfig);
    fb = { db: fs.getFirestore(app), fs };
    mode = 'firebase';
  } catch (e) {
    console.warn('Firebase indisponível, usando modo local.', e);
  }
  return mode;
}

/* ---------- Comentários ---------- */
export function subscribeComments(cb) {
  if (fb) {
    const { collection, query, orderBy, limit, onSnapshot } = fb.fs;
    const q = query(collection(fb.db, 'comentarios'), orderBy('createdAt', 'desc'), limit(100));
    return onSnapshot(q,
      snap => cb(snap.docs.map(d => {
        const x = d.data();
        return { id: d.id, ...x, createdAt: x.createdAt?.toMillis?.() ?? Date.now() };
      })),
      err => { console.warn(err); cb([]); });
  }
  listeners.comments.add(cb);
  cb(read(K.comments, []));
  return () => listeners.comments.delete(cb);
}

export async function addComment({ name, type, text }) {
  if (fb) {
    const { collection, addDoc, serverTimestamp } = fb.fs;
    await addDoc(collection(fb.db, 'comentarios'), { name, type, text, likes: 0, createdAt: serverTimestamp() });
    return;
  }
  const list = read(K.comments, []);
  list.unshift({ id: 'l' + Date.now(), name, type, text, likes: 0, createdAt: Date.now() });
  write(K.comments, list.slice(0, 100));
  notify('comments');
}

export const likedSet = () => new Set(read(K.liked, []));

export async function toggleLike(id) {
  const set = likedSet();
  const delta = set.has(id) ? -1 : 1;
  delta === 1 ? set.add(id) : set.delete(id);
  write(K.liked, [...set]);

  const isSeed = id.startsWith('s');
  if (isSeed) return;
  if (fb) {
    const { doc, updateDoc, increment } = fb.fs;
    try { await updateDoc(doc(fb.db, 'comentarios', id), { likes: increment(delta) }); } catch (e) { console.warn(e); }
  } else {
    const list = read(K.comments, []);
    const c = list.find(x => x.id === id);
    if (c) { c.likes = Math.max(0, (c.likes || 0) + delta); write(K.comments, list); notify('comments'); }
  }
}

/* ---------- Avaliações ---------- */
export function subscribeRatings(cb) {
  if (fb) {
    const { collection, onSnapshot } = fb.fs;
    return onSnapshot(collection(fb.db, 'avaliacoes'),
      snap => cb(snap.docs.map(d => d.data())),
      err => { console.warn(err); cb([]); });
  }
  listeners.ratings.add(cb);
  cb(read(K.ratings, []));
  return () => listeners.ratings.delete(cb);
}

export const ratedTopics = () => read(K.rated, {});

export async function addRating({ topic, stars }) {
  const rated = ratedTopics();
  rated[topic] = stars;
  write(K.rated, rated);
  if (fb) {
    const { collection, addDoc, serverTimestamp } = fb.fs;
    await addDoc(collection(fb.db, 'avaliacoes'), { topic, stars, createdAt: serverTimestamp() });
    return;
  }
  const list = read(K.ratings, []);
  list.push({ topic, stars, createdAt: Date.now() });
  write(K.ratings, list);
  notify('ratings');
}

/* ---------- Inscrições em cursos ----------
   A lista "minhas inscrições" fica no navegador. Se houver Firebase,
   o cadastro também é enviado para a coleção "inscricoes" (para análise). */
export const myEnrollments = () => read(K.enroll, []);

export async function enroll(data) {
  const item = { id: 'e' + Date.now(), ...data, at: Date.now() };
  const list = myEnrollments();
  list.push(item);
  write(K.enroll, list);
  if (fb) {
    const { collection, addDoc, serverTimestamp } = fb.fs;
    try {
      await addDoc(collection(fb.db, 'inscricoes'), {
        courseId: data.courseId, courseTitle: data.courseTitle, name: data.name,
        contact: data.contact, town: data.town, createdAt: serverTimestamp()
      });
    } catch (e) { console.warn(e); }
  }
  return item;
}

export function cancelEnrollment(id) {
  write(K.enroll, myEnrollments().filter(e => e.id !== id));
}

/* ---------- Vagas: interesse registrado (só no navegador) ---------- */
export const jobInterests = () => new Set(read(K.jobs, []));
export function toggleJobInterest(id) {
  const s = jobInterests();
  s.has(id) ? s.delete(id) : s.add(id);
  write(K.jobs, [...s]);
  return s.has(id);
}

// Test script to fetch prizes from Firebase
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB8HRNZcbUx8l8LI_I0NLv0SA6M18zTt_A",
  authDomain: "shraddhainstitute-8a3e2.firebaseapp.com",
  projectId: "shraddhainstitute-8a3e2",
  storageBucket: "shraddhainstitute-8a3e2.firebasestorage.app",
  messagingSenderId: "593017943268",
  appId: "1:593017943268:web:ca3f1e412c630137ec28f1",
  measurementId: "G-3Q0ZNMQJY8"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function testFetchPrizes() {
  try {
    console.log('🔍 Fetching prizes from Firestore...');
    const colRef = collection(db, 'prizes');
    const snap = await getDocs(colRef);
    
    console.log(`✅ Found ${snap.size} prize documents\n`);
    
    const prizes = [];
    snap.docs.forEach(doc => {
      const data = doc.data();
      console.log(`📦 Document ID: ${doc.id}`);
      console.log(`   - name: ${data.name}`);
      console.log(`   - alt: ${data.alt}`);
      console.log(`   - url: ${data.url}`);
      console.log(`   - order: ${data.order || 'not set'}`);
      console.log('');
      
      prizes.push({
        id: doc.id,
        name: data.name || '',
        alt: data.alt || data.name || '',
        url: data.url || null,
        order: data.order || 0,
      });
    });
    
    // Sort by order
    prizes.sort((a, b) => (a.order || 0) - (b.order || 0));
    
    console.log('🎯 Sorted prizes array:');
    console.log(JSON.stringify(prizes, null, 2));
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Error fetching prizes:', err);
    process.exit(1);
  }
}

testFetchPrizes();

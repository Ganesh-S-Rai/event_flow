import * as dotenv from 'dotenv';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

dotenv.config({ path: '.env.local' });

async function deleteAllLeads() {
    console.log('Starting lead deletion...');
    try {
        // Dynamic import to ensure env vars are loaded first
        const { db } = await import('@/lib/firebase');

        const leadsRef = collection(db, 'leads');
        const snapshot = await getDocs(leadsRef);

        if (snapshot.empty) {
            console.log('No leads found to delete.');
            return;
        }

        console.log(`Found ${snapshot.size} leads. Deleting...`);

        const deletePromises = snapshot.docs.map(document =>
            deleteDoc(doc(db, 'leads', document.id))
        );

        await Promise.all(deletePromises);
        console.log('All leads deleted successfully.');
    } catch (error) {
        console.error('Error deleting leads:', error);
    }
}

deleteAllLeads();

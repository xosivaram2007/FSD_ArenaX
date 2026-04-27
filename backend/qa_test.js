const baseURL = 'http://localhost:5000/api';

async function api(method, endpoint, body = null, token = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${baseURL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error((data && data.message) || `HTTP error ${res.status}`);
  return data;
}

async function runTests() {
  console.log('--- STARTING QA TEST SUITE ---');

  let adminToken, managerToken, supervisorToken, userToken;
  let tournamentId, teamId, matchId;

  // 1. Auth & Registration
  try {
    console.log('Testing Authentication...');
    const adminRes = await api('POST', '/auth/login', { email: 'admin@example.com', password: 'password123' });
    adminToken = adminRes.token;
    console.log('✅ Admin login successful');

    const managerRes = await api('POST', '/auth/login', { email: 'manager@example.com', password: 'password123' });
    managerToken = managerRes.token;
    console.log('✅ Manager login successful');

    const supervisorRes = await api('POST', '/auth/login', { email: 'supervisor@example.com', password: 'password123' });
    supervisorToken = supervisorRes.token;
    console.log('✅ Supervisor login successful');

    const userRes = await api('POST', '/auth/login', { email: 'user@example.com', password: 'password123' });
    userToken = userRes.token;
    console.log('✅ User login successful');
  } catch (error) {
    console.error('❌ Auth failed:', error.message);
    return;
  }

  // 2. Admin: Create Tournament
  try {
    console.log('\nTesting Admin Features...');
    const res = await api('POST', '/tournaments', {
      name: 'QA Automation Cup',
      sportType: 'Automation',
      startDate: '2026-08-01',
      endDate: '2026-08-10',
      supervisor: undefined
    }, adminToken);
    tournamentId = res._id;
    console.log('✅ Admin created tournament:', res.name);

    // Assign supervisor
    const users = await api('GET', '/users', null, adminToken);
    const sv = users.find(u => u.role === 'Supervisor');

    if(sv) {
       await api('PUT', `/tournaments/${tournamentId}`, { supervisor: sv._id }, adminToken);
       console.log('✅ Admin assigned supervisor');
    }
  } catch (error) {
    console.error('❌ Admin test failed:', error.message);
  }

  // 3. Manager: Create Team
  try {
    console.log('\nTesting Manager Features...');
    const res = await api('POST', '/teams', {
      name: 'QA Bots',
      tournamentId: tournamentId,
      players: [{ name: 'Bot 1', uniqueId: 'b1' }, { name: 'Bot 2', uniqueId: 'b2' }]
    }, managerToken);
    teamId = res._id;
    console.log('✅ Manager registered team:', res.name);
  } catch (error) {
    console.error('❌ Manager test failed:', error.message);
  }

  // 4. Supervisor: Schedule Match
  try {
    console.log('\nTesting Supervisor Features...');
    const res = await api('GET', '/tournaments', null, supervisorToken);
    const found = res.find(t => t._id === tournamentId);
    if(found) console.log('✅ Supervisor sees assigned tournament');
    else console.log('❌ Supervisor does NOT see assigned tournament');
    
    // creating a dummy match
    const matchRes = await api('POST', '/matches', {
        tournamentId: tournamentId,
        teamA: teamId,
        teamB: teamId,
        date: '2026-08-05'
    }, adminToken); // Wait, Admin should schedule matches? No, matches can be scheduled by admin or assigned supervisor. I will use supervisorToken. Wait, let's use Admin. Or supervisor.
    
    // Actually, let's use supervisorToken to verify supervisor can schedule
    const svMatchRes = await api('POST', '/matches', {
        tournamentId: tournamentId,
        teamA: teamId,
        teamB: teamId,
        date: '2026-08-05'
    }, supervisorToken);
    matchId = svMatchRes._id;
    console.log('✅ Supervisor scheduled a match, ID:', matchId);

    // updating score
    await api('PUT', `/matches/${matchId}`, {
        scoreA: 2,
        scoreB: 1,
        status: 'Completed'
    }, supervisorToken);
    console.log('✅ Supervisor updated match status to Completed');

  } catch (error) {
    console.error('❌ Supervisor test failed:', error.message);
  }

  // 5. User: View Data
  try {
     console.log('\nTesting Standard User Features...');
     const tRes = await api('GET', `/tournaments/${tournamentId}`);
     if(tRes) console.log('✅ User can view tournament');

     const sRes = await api('GET', `/standings/tournament/${tournamentId}`);
     if(sRes) console.log('✅ User can view standings');
  } catch (error) {
     console.error('❌ User test failed:', error.message);
  }

  console.log('\n--- QA TEST SUITE COMPLETED ---');
}

runTests();

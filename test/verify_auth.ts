import 'dotenv/config';
import { app } from '../src/app.js';
import { prisma } from '../src/lib/prisma.js';
import http from 'node:http';

async function runTests() {
  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const address = server.address();
  const port = typeof address === 'object' && address ? address.port : 3000;
  const baseUrl = `http://localhost:${port}/api`;

  console.log(`Test server running at ${baseUrl}`);

  try {
    // 1. Admin login
    console.log('\n--- 1. Testing Admin Login ---');
    const adminRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@gym.com',
        password: 'admin1234',
      }),
    });
    const adminData = await adminRes.json();
    console.log('Admin login status:', adminRes.status, adminData.user?.role === 'ADMIN' ? 'PASS' : 'FAIL');
    if (adminRes.status !== 200 || adminData.user?.role !== 'ADMIN' || !adminData.token) {
      throw new Error(`Admin login failed: ${JSON.stringify(adminData)}`);
    }

    // 2. Register Member and verify coupled User creation
    console.log('\n--- 2. Testing Member Registration (Coupled User) ---');
    const testMemberEmail = `test.member.${Date.now()}@example.com`;
    const plan = await prisma.membershipPlan.findFirst();
    if (!plan) throw new Error('No membership plan found');

    const createMemberRes = await fetch(`${baseUrl}/members`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Carlos',
        surname: 'Test',
        email: testMemberEmail,
        docType: 'DNI',
        docNumber: '99887766',
        birthDate: '1995-05-15',
        membershipPlanId: plan.id,
      }),
    });
    const memberData = await createMemberRes.json();
    console.log('Member create status:', createMemberRes.status, memberData.email === testMemberEmail ? 'PASS (email flattened)' : 'FAIL');
    if (createMemberRes.status !== 201 || memberData.email !== testMemberEmail) {
      throw new Error(`Member creation failed: ${JSON.stringify(memberData)}`);
    }

    // Verify User record in DB
    const userInDb = await prisma.user.findUnique({
      where: { email: testMemberEmail },
    });
    if (!userInDb || userInDb.accountStatus !== 'PENDING_ACTIVATION' || userInDb.passwordHash !== null || userInDb.role !== 'MEMBER') {
      throw new Error(`User in DB not properly created: ${JSON.stringify(userInDb)}`);
    }
    console.log('User in DB verified: PENDING_ACTIVATION, role=MEMBER, passwordHash=null: PASS');

    // 3. Login with pending account
    console.log('\n--- 3. Testing Login with Pending Account ---');
    const pendingLoginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testMemberEmail,
        password: 'somepassword',
      }),
    });
    const pendingData = await pendingLoginRes.json();
    console.log('Pending login status (expected 403):', pendingLoginRes.status, pendingData.error?.includes('activar') ? 'PASS' : 'FAIL');
    if (pendingLoginRes.status !== 403) {
      throw new Error(`Expected 403 for pending login, got ${pendingLoginRes.status}`);
    }

    // 4. Activate account with mismatched name
    console.log('\n--- 4. Testing Activation with Mismatched Name ---');
    const badNameRes = await fetch(`${baseUrl}/auth/activate-account`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testMemberEmail,
        name: 'WrongName',
        surname: 'Test',
        docNumber: '99887766',
        newPassword: 'SecurePassword123!',
      }),
    });
    const badNameData = await badNameRes.json();
    console.log('Bad name activation status (expected 400):', badNameRes.status, badNameData.error === "We couldn't verify your details" ? 'PASS' : 'FAIL');
    if (badNameRes.status !== 400 || badNameData.error !== "We couldn't verify your details") {
      throw new Error(`Expected generic verification error, got: ${JSON.stringify(badNameData)}`);
    }

    // 5. Activate account with nonexistent email
    console.log('\n--- 5. Testing Activation with Nonexistent Email ---');
    const nonExistentRes = await fetch(`${baseUrl}/auth/activate-account`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'doesnotexist@example.com',
        name: 'Carlos',
        surname: 'Test',
        docNumber: '99887766',
        newPassword: 'SecurePassword123!',
      }),
    });
    const nonExistentData = await nonExistentRes.json();
    console.log('Nonexistent email activation (expected SAME generic 400):', nonExistentRes.status, nonExistentData.error === "We couldn't verify your details" ? 'PASS' : 'FAIL');
    if (nonExistentRes.status !== 400 || nonExistentData.error !== "We couldn't verify your details") {
      throw new Error(`Expected identical generic error, got: ${JSON.stringify(nonExistentData)}`);
    }

    // 6. Valid activation
    console.log('\n--- 6. Testing Valid Account Activation ---');
    const validActivationRes = await fetch(`${baseUrl}/auth/activate-account`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testMemberEmail,
        name: 'carlos', // test case-insensitive
        surname: 'test',
        docNumber: '99887766',
        newPassword: 'SecurePassword123!',
      }),
    });
    const validActivationData = await validActivationRes.json();
    console.log('Valid activation status (expected 200):', validActivationRes.status, 'PASS');
    if (validActivationRes.status !== 200) {
      throw new Error(`Activation failed: ${JSON.stringify(validActivationData)}`);
    }

    const activatedUser = await prisma.user.findUnique({
      where: { email: testMemberEmail },
    });
    if (!activatedUser || activatedUser.accountStatus !== 'ACTIVE' || !activatedUser.passwordHash) {
      throw new Error(`User not properly marked ACTIVE in DB`);
    }
    console.log('User status in DB verified ACTIVE with hashed password: PASS');

    // 7. Re-activate already active account
    console.log('\n--- 7. Testing Re-activation of ACTIVE Account ---');
    const reActivateRes = await fetch(`${baseUrl}/auth/activate-account`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testMemberEmail,
        name: 'Carlos',
        surname: 'Test',
        docNumber: '99887766',
        newPassword: 'AnotherPassword123!',
      }),
    });
    const reActivateData = await reActivateRes.json();
    console.log('Re-activation status (expected 400 already active):', reActivateRes.status, reActivateData.error === 'Account already activated, please log in' ? 'PASS' : 'FAIL');
    if (reActivateRes.status !== 400 || reActivateData.error !== 'Account already activated, please log in') {
      throw new Error(`Expected specific already activated error, got: ${JSON.stringify(reActivateData)}`);
    }

    // 8. Login with bad password
    console.log('\n--- 8. Testing Login with Bad Password ---');
    const badPasswordRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testMemberEmail,
        password: 'wrong_password',
      }),
    });
    const badPasswordData = await badPasswordRes.json();
    console.log('Bad password login status (expected 401):', badPasswordRes.status, badPasswordData.error === 'Credenciales inválidas' ? 'PASS' : 'FAIL');
    if (badPasswordRes.status !== 401) {
      throw new Error(`Expected 401, got: ${badPasswordRes.status}`);
    }

    // 9. Login with valid password
    console.log('\n--- 9. Testing Login with Valid Password ---');
    const validLoginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testMemberEmail,
        password: 'SecurePassword123!',
      }),
    });
    const validLoginData = await validLoginRes.json();
    console.log('Valid login status (expected 200):', validLoginRes.status, validLoginData.token ? 'PASS (token received)' : 'FAIL');
    if (validLoginRes.status !== 200 || !validLoginData.token || validLoginData.user?.role !== 'MEMBER') {
      throw new Error(`Valid login failed: ${JSON.stringify(validLoginData)}`);
    }

    // 10. Instructor Registration and Activation
    console.log('\n--- 10. Testing Instructor Registration and Activation ---');
    const testInstructorEmail = `test.instructor.${Date.now()}@example.com`;
    const createInstructorRes = await fetch(`${baseUrl}/instructors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Laura',
        surname: 'Perez',
        email: testInstructorEmail,
        phone: '1144556677',
        docType: 'DNI',
        docNumber: '44556677',
      }),
    });
    const instructorData = await createInstructorRes.json();
    console.log('Instructor create status:', createInstructorRes.status, instructorData.email === testInstructorEmail ? 'PASS (email flattened)' : 'FAIL');
    if (createInstructorRes.status !== 201 || instructorData.email !== testInstructorEmail) {
      throw new Error(`Instructor creation failed: ${JSON.stringify(instructorData)}`);
    }

    const instructorUserInDb = await prisma.user.findUnique({
      where: { email: testInstructorEmail },
    });
    if (!instructorUserInDb || instructorUserInDb.role !== 'INSTRUCTOR' || instructorUserInDb.accountStatus !== 'PENDING_ACTIVATION') {
      throw new Error(`Instructor User record mismatch: ${JSON.stringify(instructorUserInDb)}`);
    }

    // Activate Instructor
    const activateInstructorRes = await fetch(`${baseUrl}/auth/activate-account`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testInstructorEmail,
        name: 'Laura',
        surname: 'Perez',
        docNumber: '44556677',
        newPassword: 'InstructorPassword123!',
      }),
    });
    console.log('Instructor activation status (expected 200):', activateInstructorRes.status, 'PASS');
    if (activateInstructorRes.status !== 200) {
      throw new Error(`Instructor activation failed`);
    }

    // Login Instructor
    const instructorLoginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testInstructorEmail,
        password: 'InstructorPassword123!',
      }),
    });
    const instructorLoginData = await instructorLoginRes.json();
    console.log('Instructor login status (expected 200):', instructorLoginRes.status, instructorLoginData.user?.role === 'INSTRUCTOR' ? 'PASS' : 'FAIL');
    if (instructorLoginRes.status !== 200 || instructorLoginData.user?.role !== 'INSTRUCTOR') {
      throw new Error(`Instructor login failed`);
    }

    // Clean up test data
    console.log('\n--- Cleaning up test records ---');
    const member = await prisma.member.findFirst({ where: { userId: userInDb.id } });
    if (member) {
      await prisma.membership.deleteMany({ where: { memberId: member.id } });
    }
    await prisma.member.deleteMany({ where: { userId: userInDb.id } });
    await prisma.user.delete({ where: { id: userInDb.id } });
    await prisma.instructor.deleteMany({ where: { userId: instructorUserInDb.id } });
    await prisma.user.delete({ where: { id: instructorUserInDb.id } });
    console.log('Test records cleaned up successfully.');


    console.log('\n========================================');
    console.log('ALL INTEGRATION TESTS PASSED PERFECTLY!');
    console.log('========================================\n');
  } finally {
    server.close();
    await prisma.$disconnect();
  }
}

runTests().catch((err) => {
  console.error('Integration test failure:', err);
  process.exit(1);
});

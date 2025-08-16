import { registerUser } from "@/lib/userStore";

export async function POST(req: Request) {
  const body = await req.json();

  try {
    const user = await registerUser({
      name: body.name,
      email: body.email,
      password: body.password,
    });

    return new Response(JSON.stringify({ success: true, user }), {
      status: 201,
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 400 }
    );
  }
}

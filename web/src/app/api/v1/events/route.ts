import { NextRequest, NextResponse } from 'next/server';
import { POST as handleExposure } from '../exposures/route';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const eventType = body.event_type;

    if (eventType === 'eligible_impression') {
      // Re-package into exposure format and process
      const exposureReq = new NextRequest(req.url, {
        method: 'POST',
        headers: req.headers,
        body: JSON.stringify(body)
      });
      return handleExposure(exposureReq);
    }

    // Handle telemetry events (session_started, session_ended)
    return NextResponse.json({
      success: true,
      event_id: body.event_id,
      event_type: eventType,
      status: 'recorded'
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

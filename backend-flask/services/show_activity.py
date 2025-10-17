from datetime import datetime, timedelta, timezone
from aws_xray_sdk.core import xray_recorder
class ShowActivities:
  def run(activity_uuid):
    segment = xray_recorder.begin_segment('user activity')
    
    now = datetime.now(timezone.utc).astimezone()
    dict = {"now": now.isoformat()}
    segment.put_metadata('key', dict, 'namespace')
    subsegment = xray_recorder.begin_subsegment('mock_data')
    results = [{
      'uuid': '68f126b0-1ceb-4a33-88be-d90fa7109eee',
      'handle':  'Andrew Brown',
      'message': 'Cloud is fun!',
      'created_at': (now - timedelta(days=2)).isoformat(),
      'expires_at': (now + timedelta(days=5)).isoformat(),
      'replies': {
        'uuid': '26e12864-1c26-5c3a-9658-97a10f8fea67',
        'handle':  'Worf',
        'message': 'This post has no honor!',
        'created_at': (now - timedelta(days=2)).isoformat()
      }
    }]
    return results
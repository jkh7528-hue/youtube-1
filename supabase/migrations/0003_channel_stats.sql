-- 채널별 영상 집계를 DB에서 처리 (성능 + 정확성 수정)
--
-- 이전에는 src/lib/queries.ts의 getChannels()가 모든 채널의 videos 행을
-- 전부 가져와 JS에서 세었습니다. 두 가지 문제가 있었습니다:
--   1) 성능 — /channels 를 열 때마다, 그리고 ♡ 버튼처럼 revalidatePath("/channels")를
--      호출하는 액션마다 영상 수만 건이 네트워크로 흘렀습니다.
--   2) 정확성 — PostgREST 기본 행 제한(1000) 때문에 영상이 1000개를 넘으면
--      집계가 조용히 잘린 값으로 표시됐습니다.
-- 이 뷰는 채널당 정확히 한 행만 반환합니다.

create or replace view channel_video_stats
with (security_invoker = on)
as
select
  c.id as channel_id,
  count(v.id) as video_count,
  count(v.id) filter (where v.is_cardiac_arrest) as cardiac_arrest_count
from channels c
left join videos v on v.channel_id = c.id
group by c.id;

-- 뷰는 서비스 롤로만 읽습니다 (기본 테이블과 동일한 정책).
revoke all on channel_video_stats from anon, authenticated;

-- 위 filter 집계와 채널 상세 페이지의 심정지 목록을 인덱스로 받쳐줍니다.
create index if not exists videos_channel_cardiac_idx
  on videos(channel_id, is_cardiac_arrest);

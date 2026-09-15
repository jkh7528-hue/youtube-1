-- 이미 본 영상 표시
--
-- 목록에서 영상을 클릭해 유튜브로 나가면 여기에 시각이 찍힙니다. 목록은
-- 안 본 영상(watched_at is null)을 먼저, 본 영상을 뒤로 정렬하므로 같은
-- 소재를 두 번 검토하는 일이 줄어듭니다.
--
-- 앱은 서비스 롤로만 접근하므로 별도 정책은 필요 없습니다 (0001_init.sql 참고).

alter table videos add column if not exists watched_at timestamptz;

-- 목록 쿼리가 watched_at -> recent_vph / latest_view_count 순으로 정렬하므로
-- 정렬 선두 컬럼에 인덱스를 둡니다. 안 본 영상이 대다수라 nulls first가 유리합니다.
create index if not exists videos_watched_idx
  on videos(watched_at nulls first);

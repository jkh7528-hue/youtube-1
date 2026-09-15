# 심정지 발굴기

카테고리별 유튜브 **급상승** 영상으로 트렌드를 파악하고, 조회수는 높지만 최근엔 조회수가
멈춰버린 **심정지** 영상(예능/코미디/일상 짜집기용 소재)을 찾아주는 개인용 도구입니다.
([vph.kr](https://vph.kr/) 참고)

- **급상승**: 최근 N일 내 업로드된 영상 중 시간당 조회수(VPH)가 높은 순
- **심정지**: 누적 조회수가 기준치(기본 100만) 이상인데 최근 VPH가 기준치(기본 100) 이하로 떨어진 영상
- **카테고리**: 채널을 직접 큐레이션해서 묶는 방식 (예: "예능/코미디 짜집기"). 카테고리에
  등록된 채널들의 영상만 집계하기 때문에 브이로그/광고 등 노이즈가 섞이지 않습니다.
- **관심채널**: 채널을 등록하면 그 채널의 업로드 영상 전체(과거 영상 포함)를 대상으로
  심정지 영상을 자동으로 찾아 채널 상세 페이지에서 보여줍니다.

VPH는 유튜브 API가 바로 알려주지 않기 때문에, 이 앱은 주기적으로(기본 1시간마다) 각 영상의
조회수를 스냅샷으로 저장해두고 그 변화량으로 직접 계산합니다. **주기적 수집(cron)을 연결하지
않으면 VPH와 심정지 판정이 채워지지 않습니다** — 아래 5번을 꼭 설정하세요.

## 처음 설정하기

### 1. Supabase 프로젝트

1. [supabase.com](https://supabase.com)에서 프로젝트를 만듭니다.
2. `supabase/migrations/` 안의 파일을 번호 순서대로 SQL Editor에서 실행합니다
   (`0001_init.sql` → `0002_functions.sql` → `0003_channel_stats.sql`).
   또는 Supabase CLI의 `supabase db push`.

   > **이미 운영 중이라면 `0003_channel_stats.sql`을 꼭 실행하세요.** 관심채널 목록의
   > 영상/심정지 개수를 DB에서 집계하는 뷰입니다. 없으면 앱이 느린 예전 방식으로 대체
   > 동작하는데, 그 경로는 영상이 1000개를 넘으면 개수가 잘못 표시됩니다.
3. Settings → API에서 Project URL, publishable key, secret key(또는 구버전 프로젝트라면
   anon key / service_role key)를 확인합니다.

### 2. YouTube Data API 키

1. [Google Cloud Console](https://console.cloud.google.com)에서 프로젝트를 만들고
   **YouTube Data API v3**를 사용 설정합니다.
2. API 키를 발급합니다 (사용량이 걱정되면 이 API로 제한을 걸어두세요).
3. 무료 할당량은 하루 10,000 유닛입니다. 이 앱은 대부분 `videos.list`/`playlistItems.list`
   (1~2 유닛)만 쓰도록 설계돼 있어서, 채널 수십 개 규모에서는 여유롭습니다. 새 채널을
   `search`로 찾아야 하는 경우(레거시 `/c/`, `/user/` URL)만 100 유닛이 듭니다.

### 3. 환경변수

`.env.example`을 `.env.local`로 복사하고 값을 채웁니다.

```bash
cp .env.example .env.local
```

| 변수 | 설명 |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable(anon) key |
| `SUPABASE_SECRET_KEY` | Supabase secret(service_role) key — **서버 전용**, 절대 클라이언트에 노출 금지 |
| `YOUTUBE_API_KEY` | YouTube Data API v3 키 |
| `CRON_SECRET` | `/api/cron/refresh` 호출 인증용 임의의 긴 문자열 |
| `APP_PASSWORD` | 사이트 접속 비밀번호 (비워두면 게이트 비활성화) |

### 4. 로컬 실행

```bash
npm install
npm run dev
```

`http://localhost:3000` 접속 → 비밀번호 입력 → `/channels`에서 카테고리 폴더를 열고
그 안에서 관심채널을 하나 추가해보세요. 폴더 안에서 추가하면 그 카테고리가 자동으로 선택됩니다.
채널을 추가하면 즉시 일부 영상을 가져오지만(최대 10페이지, 약 500개), 전체 백필과 VPH 계산은
아래 cron이 주기적으로 돌아야 완성됩니다.

### 5. 주기적 수집(cron) 연결 — 필수

`.github/workflows/refresh-cron.yml`이 **하루 두 번** 수집을 돌립니다 — 아침 8시, 저녁 10시(KST).
GitHub Actions는 UTC로 돌기 때문에 워크플로에는 `0 23 * * *`과 `0 13 * * *`으로 적혀 있습니다.

**배포가 필요 없습니다.** 이 잡은 러너 안에서 `next build` → `next start`를 한 뒤
자기 자신의 `/api/cron/refresh`를 호출합니다. 예전에는 배포된 `SITE_URL`을 curl로 찔렀는데,
그 주소가 존재하지 않아 예약된 실행이 전부 실패했습니다.

저장소 Settings → Secrets and variables → Actions → **Secrets** 에 5개를 등록하세요.
`.env.local`에 쓰는 값과 같습니다:

| 시크릿 | 설명 |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | publishable(anon) key |
| `SUPABASE_SECRET_KEY` | secret(service_role) key |
| `YOUTUBE_API_KEY` | YouTube Data API v3 키 |
| `CRON_SECRET` | 아무 긴 임의 문자열 (이 잡 안에서만 씁니다) |

하나라도 비어 있으면 스캔을 건너뛰고 **무엇이 비었는지 Job Summary에 적어줍니다.**

이 워크플로는 **항상 성공으로 끝납니다**(exit 0). "Run failed" 메일이 오는 걸 막기 위해서이고,
빌드 실패나 기동 실패도 잡을 실패시키지 않습니다. 대신 매 실행의 **Job Summary**(Actions 탭 →
실행 클릭 → 요약 화면)에 결과나 실패 원인이 한국어로 적힙니다. 갱신이 안 되는 것 같으면
로그가 아니라 거기를 보세요.

> 덤: 하루 두 번 Supabase에 접속하므로, 무료 플랜이 장기 미사용으로 프로젝트를 자동 정지시키는
> 것도 예방됩니다.

**하루 2회의 대가.** 새 영상의 첫 VPH가 잡히는 시점이 발견 후 ~1시간에서 **~10~14시간**으로
늦어지고(스냅샷 두 개가 1시간 이상 벌어져야 계산됨), 급상승 순위도 하루 두 번만 바뀝니다.
VPH 값 자체는 두 스냅샷의 실제 경과 시간으로 나누므로 정확합니다.

## 판정 기준 조정

`/settings`에서 다음 값을 바꿀 수 있습니다 (기본값):

- 심정지 최소 누적 조회수: **1,000,000**
- 심정지 최대 최근 VPH: **100**
- VPH 계산 기준 시간: **24시간** (최신 스냅샷 vs. 이만큼 전 스냅샷 비교)
- 급상승 후보 기간: **14일** (이 기간 내 업로드만 급상승 랭킹 대상)

## 배포

Vercel에 연결하고(또는 다른 Node 호스팅) 위 환경변수를 프로젝트 설정에 등록한 뒤 배포하면
됩니다.

수집 작업은 호스트가 함수를 강제 종료하기 전에 **스스로 멈추고 다음 실행에 넘깁니다.**
한 번에 다시 확인할 영상 수의 상한은 `CRON_MAX_STATS`(기본 **1500**)로 정합니다.
한 번의 실행이 쓸 수 있는 시간은 `CRON_BUDGET_SECONDS` 환경변수로 정하며 기본값은 **50초**로,
Vercel Hobby의 60초 하드 리밋 안에 들어갑니다. Pro 이상(최대 300초)이라면 `CRON_BUDGET_SECONDS`를
`250` 정도로 올리면 한 번에 더 많이 처리합니다. 예산을 넘겨 중단되면 응답 JSON의
`timedOut`이 `true`가 되고, 다음 실행이 가장 오래된 것부터 이어서 갱신합니다.

## 아키텍처 메모

- 모든 데이터 접근은 서버(Server Components / Server Actions / cron route)에서
  `SUPABASE_SECRET_KEY`로 이뤄집니다. 클라이언트에서 Supabase를 직접 호출하지 않고, 모든
  테이블에 RLS만 켜두고 정책은 없음 → anon 키로는 아무것도 못 읽습니다.
- `src/lib/refresh.ts`가 핵심 엔진입니다: 채널별 업로드 재생목록을 페이지네이션하며 새
  영상을 찾고, 추적 중인 영상의 통계를 배치로 갱신하고(`video_snapshots`에 스냅샷 적재),
  Postgres 함수 `refresh_video_metrics`(`supabase/migrations/0002_functions.sql`)로 VPH와
  심정지 여부를 계산해 `videos` 테이블에 캐시합니다.
- 채널 전체 백필은 한 번에 끝내지 않고 `channels.backfill_page_token`에 이어서 진행합니다
  (영상이 몇천 개인 채널도 실행 시간 초과 없이 몇 번의 cron 주기에 걸쳐 완료됩니다).

## 남겨진 것

기존에 이 저장소에 있던 무관한 플레이스홀더 회사 소개 사이트(원전 제어반 제조업체 데모)는
정리했습니다. 혹시 그 내용이 필요하시면 git 히스토리에 남아있습니다.

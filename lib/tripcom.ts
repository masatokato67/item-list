import { JapanPlace } from "./types";

/**
 * Trip.com アフィリエイトリンクの組み立て。
 *
 * パラメータ名は管理画面が発行した実リンクで確認済み:
 *   https://jp.trip.com/hotels/list?city=228&…&Allianceid=10172373&SID=328958470
 *     &trip_sub1=test&trip_sub3=D19508183
 *
 * このため、管理画面で1本ずつリンクを発行しなくても、素のTrip.comのURLに
 * パラメータを付けるだけで成果が計測される。JSONには通常のURLを書けばよい。
 *
 * リンクは次の優先順で決まる:
 * 1. JSON に `affiliateUrl` があればそのまま使う（管理画面発行リンクを貼った場合）
 * 2. `url` があれば Allianceid / SID / trip_sub1 を付与する
 * 3. `url` がなければ null（CTAボタンを出さず、記事カードとして表示する）
 *
 * 環境変数（.env.local と Vercel の両方に設定すること）:
 *   NEXT_PUBLIC_TRIPCOM_ALLIANCE_ID … 管理画面の Allianceid
 *   NEXT_PUBLIC_TRIPCOM_SID         … 同 SID
 *
 * どちらもリンクに露出する公開値なので NEXT_PUBLIC_ で問題ない。
 * 未設定の場合は素のURLにフォールバックする（＝成果が計上されない）ため、
 * 本番ビルド時は警告を出す。
 */

const ALLIANCE_ID = process.env.NEXT_PUBLIC_TRIPCOM_ALLIANCE_ID;
const SID = process.env.NEXT_PUBLIC_TRIPCOM_SID;

if (process.env.NODE_ENV === "production" && (!ALLIANCE_ID || !SID)) {
  console.warn(
    "[tripcom] NEXT_PUBLIC_TRIPCOM_ALLIANCE_ID / NEXT_PUBLIC_TRIPCOM_SID が未設定です。" +
      "Trip.comへのリンクはアフィリエイトパラメータなしで出力され、成果が計上されません。"
  );
}

/**
 * @param sourceId trip_sub1 に入れる識別子。どの記事のどの宿からの遷移かを
 *   Trip.com のレポートで判別するために使う。例: "tokyo-hotels-indoor-pools-1"
 */
function withAffiliateParams(rawUrl: string, sourceId?: string): string {
  if (!ALLIANCE_ID || !SID) return rawUrl;
  try {
    const url = new URL(rawUrl);
    // 管理画面で発行済みのリンクは既にパラメータを持つので上書きしない
    if (url.searchParams.has("Allianceid")) return rawUrl;
    url.searchParams.set("Allianceid", ALLIANCE_ID);
    url.searchParams.set("SID", SID);
    if (sourceId) url.searchParams.set("trip_sub1", sourceId);
    return url.toString();
  } catch {
    // URLとして解釈できない値はそのまま返す（ビルドを落とさない）
    return rawUrl;
  }
}

/** そのスポットの予約リンク。出せるリンクがなければ null */
export function bookingHref(
  place: JapanPlace,
  sourceId?: string
): string | null {
  if (place.affiliateUrl) return place.affiliateUrl;
  if (place.url) return withAffiliateParams(place.url, sourceId);
  return null;
}

/** trip_sub1 用の識別子。記事slug＋掲載順で、どの宿からの遷移か分かるようにする */
export function trackingId(slug: string, rank: number): string {
  return `${slug}-${rank}`;
}

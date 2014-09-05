<?xml version="1.0" encoding="utf-8" ?>
<xsl:stylesheet
        xmlns:xsl="http://www.w3.org/1999/XSL/Transform"

        version="1.0">

    <!-- фид новостей -->
    <xsl:template match="component[@class='NewsFeed']">
        <div class="feed news">
            <xsl:apply-templates/>
        </div>
    </xsl:template>

    <xsl:template match="record[ancestor::component[@class='NewsFeed'][@type='list']]">
        <div class="media">
            <xsl:if test="$COMPONENTS[@editable]">
                <xsl:attribute name="record">
                    <xsl:value-of select="field[@index='PRI']"/>
                </xsl:attribute>
            </xsl:if>
            <xsl:if test="field[@name='attachments']/recordset">
                <div class="feed_image">
                    <xsl:choose>
                        <xsl:when test="field[@name='news_text_rtf']=1">
                            <a href="{$BASE}{$LANG_ABBR}{field[@name='category']/@url}{field[@name='news_id']}--{field[@name='news_segment']}/">
                                <xsl:apply-templates select="field[@name='attachments']" mode="preview">
                                    <xsl:with-param name="PREVIEW_WIDTH">90</xsl:with-param>
                                    <xsl:with-param name="PREVIEW_HEIGHT">68</xsl:with-param>
                                </xsl:apply-templates>
                            </a>
                        </xsl:when>
                        <xsl:otherwise>
                            <xsl:apply-templates select="field[@name='attachments']" mode="preview">
                                <xsl:with-param name="PREVIEW_WIDTH">90</xsl:with-param>
                                <xsl:with-param name="PREVIEW_HEIGHT">68</xsl:with-param>
                            </xsl:apply-templates>
                        </xsl:otherwise>
                    </xsl:choose>
                </div>
            </xsl:if>
            <div class="feed_date">
                <xsl:value-of select="field[@name='news_date']"/>
            </div>
            <h4 class="feed_name">
                <xsl:choose>
                    <xsl:when test="field[@name='news_text_rtf']=1">
                        <a href="{$BASE}{$LANG_ABBR}{field[@name='category']/@url}{field[@name='news_id']}--{field[@name='news_segment']}/">
                            <xsl:value-of select="field[@name='news_title']" disable-output-escaping="yes"/>
                        </a>
                    </xsl:when>
                    <xsl:otherwise>
                        <xsl:value-of select="field[@name='news_title']" disable-output-escaping="yes"/>
                    </xsl:otherwise>
                </xsl:choose>
            </h4>
            <div class="feed_announce">
                <xsl:value-of select="field[@name='news_announce_rtf']" disable-output-escaping="yes"/>
            </div>
        </div>
    </xsl:template>

    <xsl:template match="record[ancestor::component[@class='NewsFeed'][@type='form']]">
        <div class="feed_view" id="{generate-id(../.)}">
            <xsl:if test="$COMPONENTS[@editable]">
                <xsl:attribute name="current">
                    <xsl:value-of select="field[@index='PRI']"/>
                </xsl:attribute>
            </xsl:if>
            <div class="feed_date">
                <xsl:value-of select="field[@name='news_date']"/>
            </div>
            <xsl:apply-templates select="field[@name='news_title']"/>
            <xsl:if test="field[@name='attachments']/recordset">
                <div class="feed_image">
                    <xsl:apply-templates select="field[@name='attachments']" mode="preview">
                        <xsl:with-param name="PREVIEW_WIDTH">260</xsl:with-param>
                        <xsl:with-param name="PREVIEW_HEIGHT">195</xsl:with-param>
                    </xsl:apply-templates>
                </div>
            </xsl:if>
            <xsl:apply-templates select="field[@name='news_text_rtf']"/>
            <xsl:if test="field[@name='attachments']/recordset">
                <div class="media_box">
                    <xsl:apply-templates select="field[@name='attachments']" mode="carousel">
                        <xsl:with-param name="WIDTH">664</xsl:with-param>
                        <xsl:with-param name="HEIGHT">498</xsl:with-param>
                    </xsl:apply-templates>
                </div>
            </xsl:if>
            <div class="go_back">
                <a href="{$BASE}{$LANG_ABBR}{../../@template}"><xsl:value-of select="$TRANSLATION[@const='TXT_BACK_TO_LIST']"/></a>
            </div>
        </div>
    </xsl:template>

    <xsl:template match="component[@name='topNews']">
        <div>
            <xsl:apply-templates/>
        </div>
    </xsl:template>

    <xsl:template match="recordset[parent::component[@name='topNews'][@type='list']]">
        <div id="{generate-id(.)}">
            <xsl:apply-templates/>
        </div>
        <div class="read_more">
            <a href="{$BASE}{$LANG_ABBR}{../@template}"><xsl:value-of select="$TRANSLATION[@const='TXT_ALL_NEWS']"/></a>
        </div>
    </xsl:template>

    <xsl:template match="record[ancestor::component[@name='topNews'][@type='list']]">
        <div class="media">
            <xsl:if test="$COMPONENTS[@editable]">
                <xsl:attribute name="record">
                    <xsl:value-of select="field[@index='PRI']"/>
                </xsl:attribute>
            </xsl:if>
            <div class="pull-left">
                <xsl:choose>
                    <xsl:when test="field[@name='news_text_rtf']=1">
                        <a href="{$BASE}{$LANG_ABBR}{field[@name='category']/@url}{field[@name='news_id']}--{field[@name='news_segment']}/">
                            <img class="media-object img-responsive img-thumbnail" src="{$RESIZER_URL}w90-h68/{field[@name='attachments']/recordset/record/field[@name='file']}" alt=""/>
                        </a>
                    </xsl:when>
                    <xsl:otherwise>
                        <img class="media-object img-responsive img-thumbnail" src="{$RESIZER_URL}w90-h68/{field[@name='attachments']/recordset/record/field[@name='file']}" alt=""/>
                    </xsl:otherwise>
                </xsl:choose>
            </div>
            <div class="media-body">
                <small class="text-muted">
                    <xsl:value-of select="field[@name='news_date']"/>
                </small>
                <h4 class="media-heading">
                    <xsl:choose>
                        <xsl:when test="field[@name='news_text_rtf']=1">
                            <a href="{$BASE}{$LANG_ABBR}{field[@name='category']/@url}{field[@name='news_id']}--{field[@name='news_segment']}/">
                                <xsl:value-of select="field[@name='news_title']" disable-output-escaping="yes"/>
                            </a>
                        </xsl:when>
                        <xsl:otherwise>
                            <xsl:value-of select="field[@name='news_title']" disable-output-escaping="yes"/>
                        </xsl:otherwise>
                    </xsl:choose>
                </h4>
            </div>
        </div>
    </xsl:template>
    <!-- /фид новостей -->

</xsl:stylesheet>
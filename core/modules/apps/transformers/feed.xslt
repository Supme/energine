<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet
        version="1.0"
        xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
        xmlns="http://www.w3.org/1999/xhtml">

    <!-- обработка компонента типа feed -->
    <xsl:template match="component[@exttype='feed']">
        <xsl:apply-templates/>
    </xsl:template>

    <!-- компонент feed в режиме списка -->
    <xsl:template match="recordset[parent::component[@exttype='feed'][@type='list']]">
        <ul id="{generate-id(.)}" class="feed">
            <xsl:choose>
                <xsl:when test="parent::component[@class='NewsFeed']">
                    <xsl:attribute name="class">feed news</xsl:attribute>
                </xsl:when>
            </xsl:choose>
            <xsl:apply-templates/>
        </ul>

    </xsl:template>

    <xsl:template match="record[ancestor::component[@exttype='feed'][@type='list']]">
        <li>
            <xsl:if test="$COMPONENTS[@editable]">
                <xsl:attribute name="record">
                    <xsl:value-of select="field[@index='PRI']"/>
                </xsl:attribute>
            </xsl:if>
            <xsl:apply-templates/>
            <xsl:if test="../../toolbar[@name!='pager']">
                <xsl:apply-templates select="../../toolbar[@name!='pager']/control" />
            </xsl:if>
        </li>
    </xsl:template>

    <xsl:template match="record[ancestor::component[@class='NewsFeed'][@type='list']]">
        <li>
            <xsl:if test="$COMPONENTS[@editable]">
                <xsl:attribute name="record">
                    <xsl:value-of select="field[@index='PRI']"/>
                </xsl:attribute>
            </xsl:if>
            <div class="date">
                <strong>
                    <xsl:value-of select="field[@name='news_date']"/>
                </strong>
            </div>
            <h4 class="title">
                <a href="{$BASE}{$LANG_ABBR}{field[@name='category']/@url}{field[@name='news_id']}--{field[@name='news_segment']}/">
                    <xsl:value-of select="field[@name='news_title']"/>
                </a>
            </h4>
            <xsl:if test="field[@name='attachments'] and field[@name='attachments']/recordset/record">
                <img src="{$MEDIA_URL}slir/w90-h68-c90:68/{field[@name='attachments']/recordset/record/field[@name='file']/image}" alt="" width="90" height="68"/>
            </xsl:if>
            <div class="anounce">
                <xsl:value-of select="field[@name='news_announce_rtf']" disable-output-escaping="yes"/>
            </div>
        </li>
    </xsl:template>

    <xsl:template match="toolbar[ancestor::component[@exttype='feed'][@type='list']][@name!='pager']"/>

    <xsl:template match="control[parent::toolbar[@name!='pager' and ancestor::component[@exttype='feed'][@type='list']]]">
        <a href="{$BASE}{$LANG_ABBR}{ancestor::component/@template}"><xsl:value-of select="@title"/></a>
    </xsl:template>

    <!-- компонент feed в режиме просмотра -->
    <xsl:template match="recordset[parent::component[@exttype='feed'][@type='form']]">
        <xsl:apply-templates/>
    </xsl:template>

    <xsl:template match="record[ancestor::component[@exttype='feed'][@type='form']]">
        <div class="feed" id="{generate-id(../.)}">
            <xsl:if test="$COMPONENTS[@editable]">
                <xsl:attribute name="current">
                    <xsl:value-of select="field[@index='PRI']"/>
                </xsl:attribute>
            </xsl:if>
            <xsl:apply-templates/>
        </div>
    </xsl:template>

    <xsl:template match="record[ancestor::component[@class='NewsFeed'][@type='form']]">
        <div class="feed news_view" id="{generate-id(../.)}">
            <xsl:if test="$COMPONENTS[@editable]">
                <xsl:attribute name="current">
                    <xsl:value-of select="field[@index='PRI']"/>
                </xsl:attribute>
            </xsl:if>
            <div class="date">
                <strong>
                    <xsl:value-of select="field[@name='news_date']"/>
                </strong>
            </div>
            <h4 class="title">
                <xsl:value-of select="field[@name='news_title']"/>
            </h4>
            <xsl:apply-templates select="field[(@name!='news_date') and (@name!='news_title') and(@name!='smap_id')]"/>
        </div>
    </xsl:template>

    <xsl:template match="component[@exttype='feededitor'][@type='list']">
        <xsl:if test="recordset">
            <xsl:variable name="LINK">
                <xsl:value-of select="@linkedComponent"/>
            </xsl:variable>
            <ul id="{generate-id(recordset)}" style="display:none;"
                single_template="{$BASE}{$LANG_ABBR}{@single_template}"
                linkedTo="{generate-id($COMPONENTS[@name=$LINK]/recordset)}">
                <xsl:for-each select="toolbar/control">
                    <li id="{@id}" title="{@title}" type="{@type}" action="{@onclick}"></li>
                </xsl:for-each>
            </ul>
        </xsl:if>
    </xsl:template>

    <xsl:template match="field[@type='htmlblock' and ancestor::component[@exttype='feed' and @type='form']]">
        <xsl:variable name="FIELD_VALUE">
            <xsl:choose>
                <xsl:when test="ancestor::component/@editable and (.='')"><xsl:value-of select="$NBSP" disable-output-escaping="yes"/></xsl:when>
                <xsl:otherwise><xsl:value-of select="."/></xsl:otherwise>
            </xsl:choose>
        </xsl:variable>
        <div class="feed_text">
            <xsl:if test="ancestor::component/@editable">
                <xsl:attribute name="class">nrgnEditor feed_text</xsl:attribute>
                <xsl:attribute name="num">
                    <xsl:value-of select="@name"/>
                </xsl:attribute>
                <xsl:attribute name="single_template">
                    <xsl:value-of select="$BASE"/><xsl:value-of
                        select="$LANG_ABBR"/><xsl:value-of
                        select="ancestor::component/@single_template"/>
                </xsl:attribute>
                <xsl:attribute name="eID">
                    <xsl:value-of select="../field[@index='PRI']"/>
                </xsl:attribute>
            </xsl:if>
            <xsl:value-of select="$FIELD_VALUE" disable-output-escaping="yes"/>
        </div>
    </xsl:template>

    <xsl:template match="field[@name='attachments'][ancestor::component[@type='form' and @exttype='feed']]">
        <xsl:if test="recordset">
        <xsl:choose>
            <xsl:when test="(count(recordset/record) &gt; 1) or (name(recordset/record[1]/field[@name='file']/*[1]) = 'video')">
                <div class="feed_media">
                <script type="text/javascript" src="scripts/Carousel.js"></script>

                <script type="text/javascript">
                    var carousel, playlist;

                    window.addEvent('domready', function() {
                        carousel = new Carousel('playlist');

                    });
                </script>
                <!-- Тут идет формирование плейлиста -->
                <div class="carousel_box">
                    <div class="carousel_title">
                        <xsl:value-of select="@title"/>
                    </div>
                    <div class="carousel" id="playlist">
                        <div class="carousel_viewbox viewbox">
                            <ul>
                                <xsl:for-each select="recordset/record">
                                    <li>
                                        <div class="carousel_image" id="{field[@name='id']}_imgc">
                                            <a href="{field[@name='file']/video | field[@name='file']/image}"
                                               xmlns:nrgn="http://energine.org"
                                               nrgn:media_type="{name(field[@name='file']/child::*[1])}">
                                                <img src="{$MEDIA_URL}slir/w90-h68-c90:68/{field[@name='file']/image}"
                                                     width="90" height="68"
                                                     alt="{field[@name='name']}"/>
                                                <xsl:if test="field[@name='file']/video">
                                                    <i class="icon32x32 play_icon">
                                                        <i></i>
                                                    </i>
                                                </xsl:if>
                                            </a>
                                        </div>
                                    </li>
                                </xsl:for-each>
                            </ul>
                        </div>
                        <a class="icon20x20 previous_control previous" href="#">
                            <i></i>
                        </a>
                        <a class="icon20x20 next_control next" href="#">
                            <i></i>
                        </a>
                    </div>
                </div>

            </div>
            </xsl:when>
            <xsl:otherwise>

            </xsl:otherwise>
        </xsl:choose>
        <div class="player_box" id="playerBox">
                    <img src="{$MEDIA_URL}slir/w640-h480-c640:480/{recordset/record[1]/field[@name='file']/child::*[1]/@image}"
                         alt=""/>
                </div>
        </xsl:if>
    </xsl:template>

    <xsl:template match="field[ancestor::component[@exttype='feed'] and @name='smap_id']" />


</xsl:stylesheet>
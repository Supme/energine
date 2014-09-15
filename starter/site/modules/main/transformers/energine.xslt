<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet
    version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <!--Собственно отсюда и пляшем-->
    <!--Здесь можно сколько угодно дописывать, главное вызвать обработчки рута в моде head?в котором сосредоточены все команды необходимые для корректного формирования страницы-->
    <xsl:template match="/">
        <xsl:text disable-output-escaping="yes">&lt;!--[if lt IE 7]&gt; &lt;html class="no-js lt-ie9 lt-ie8 lt-ie7"&gt;&lt;![endif]--&gt;</xsl:text>
        <xsl:text disable-output-escaping="yes">&lt;!--[if IE 7]&gt; &lt;html class="no-js lt-ie9 lt-ie8 "&gt;&lt;![endif]--&gt;</xsl:text>
        <xsl:text disable-output-escaping="yes">&lt;!--[if IE 8]&gt; &lt;html class="no-js lt-ie9"&gt;&lt;![endif]--&gt;</xsl:text>
        <xsl:text disable-output-escaping="yes">&lt;!--[if gt IE 8]&gt; &lt;!--&gt;</xsl:text>
        <html  class="no-js">
        <xsl:text disable-output-escaping="yes">&lt;!--&lt;![endif]--&gt;</xsl:text>
            <head>
                <!--
                Внутри происходят вызовы
                <xsl:apply-templates select="." mode="favicon"/>
                <xsl:apply-templates select="." mode="title"/>
                <xsl:apply-templates select="." mode="stylesheets"/>
                <xsl:apply-templates select="." mode="scripts"/>
                -->
                <xsl:apply-templates select="." mode="head"/>

            </head>
            <body>
                <xsl:apply-templates select="document"/>
            </body>
        </html>
    </xsl:template>

    <xsl:template match="/" mode="favicon">
        <link rel="shortcut icon" href="{$STATIC_URL}favicon.ico" type="image/x-icon"/>
        <link rel="icon" href="{$STATIC_URL}favicon.ico" type="image/x-icon"/>
        <link rel="apple-touch-icon" href="{$STATIC_URL}apple-touch-icon.png" />
    </xsl:template>

    <xsl:template match="/" mode="stylesheets">
        <!-- файлы стилей для текущего варианта дизайна -->
        <link href="{$STATIC_URL}stylesheets/{$FOLDER}/main.css" rel="stylesheet" type="text/css" media="Screen, projection"/>
    </xsl:template>

    <xsl:template match="/" mode="scripts">
        <xsl:if test="not($DOC_PROPS[@name='single'])"><!-- User JS is here--></xsl:if>
    </xsl:template>

    <!-- page body -->
    <xsl:template match="document">
        <xsl:if test="$COMPONENTS[@class='Ads']/recordset/record/field[@name='ad_top_728_90']">
            <div class="top_adblock">
                <xsl:value-of select="$COMPONENTS[@class='Ads']/recordset/record/field[@name='ad_top_728_90']" disable-output-escaping="yes"/>
            </div>
        </xsl:if>
        <xsl:if test="$COMPONENTS[@class='CrossDomainAuth']">
            <img src="{$COMPONENTS[@class='CrossDomainAuth']/@authURL}?return={$COMPONENTS[@class='CrossDomainAuth']/@returnURL}" width="1" height="1" style="display:none;" alt="" onload="document.location = document.location.href;"/>
        </xsl:if>
        <div class="base">
            <div class="header">
                <h1 class="logo">
                    <a>
                        <xsl:if test="$DOC_PROPS[@name='main']!=1">
                            <xsl:attribute name="href"><xsl:value-of select="$BASE"/><xsl:value-of select="$LANG_ABBR"/></xsl:attribute>
                        </xsl:if>
                        <img src="{$STATIC_URL}images/{$FOLDER}/energine_logo.png" width="246" height="64" alt="Energine"/>
                    </a>
                </h1>
                <xsl:apply-templates select="$COMPONENTS[@class='LangSwitcher']"/>
            </div>
            <div class="main">
                <xsl:apply-templates select="$COMPONENTS[@name='breadCrumbs']"/>
                <xsl:apply-templates select="content"/>
            </div>
            <div class="footer">
                <xsl:apply-templates select="$COMPONENTS[@name='footerTextBlock']"/>
            </div>
        </div>
    </xsl:template>
    <!-- /page body -->

    <!-- PageList and NavigationMenu -->
    <xsl:template match="component[@class='PageList' or @class='NavigationMenu']">
        <xsl:apply-templates/>
    </xsl:template>
    
    <xsl:template match="recordset[ancestor::component[@class='PageList'] or ancestor::component[@class='NavigationMenu']]">
        <xsl:if test="not(@empty)">
            <ul class="menu clearfix">
                <xsl:apply-templates/>
            </ul>
        </xsl:if>
    </xsl:template>    

    <xsl:template match="record[ancestor::component[@class='PageList']]">
        <li class="menu_item">
            <div class="menu_name">
                <a>
                    <xsl:if test="$DOC_PROPS[@name='ID']!=field[@name='Id']">
                        <xsl:attribute name="href">
                            <xsl:choose>
                                <xsl:when test="field[@name='Redirect']=''"><xsl:value-of select="$LANG_ABBR"/><xsl:value-of select="field[@name='Segment']"/></xsl:when>
                                <xsl:otherwise><xsl:value-of select="field[@name='Redirect']"/></xsl:otherwise>
                            </xsl:choose>
                        </xsl:attribute>
                    </xsl:if>
                    <xsl:value-of select="field[@name='Name']"/>
                </a>
            </div>
            <xsl:if test="field[@name='attachments']/recordset">
                <div class="menu_image">
                    <a>
                        <xsl:if test="$DOC_PROPS[@name='ID']!=field[@name='Id']">
                            <xsl:attribute name="href">
                                <xsl:value-of select="$LANG_ABBR"/><xsl:value-of select="field[@name='Segment']"/>
                            </xsl:attribute>
                        </xsl:if>
                        <xsl:apply-templates select="field[@name='attachments']" mode="preview">
                            <xsl:with-param name="PREVIEW_WIDTH">90</xsl:with-param>
                            <xsl:with-param name="PREVIEW_HEIGHT">68</xsl:with-param>
                        </xsl:apply-templates>
                    </a>
                </div>
            </xsl:if>
            <xsl:if test="field[@name='DescriptionRtf'] != ''">
                <div class="menu_announce">
                    <xsl:value-of select="field[@name='DescriptionRtf']" disable-output-escaping="yes"/>
                </div>
            </xsl:if>
            <xsl:if test="recordset">
                <xsl:apply-templates/>
            </xsl:if>
        </li>
    </xsl:template>
    
    <xsl:template match="record[ancestor::component[@class='NavigationMenu']]">
        <li class="menu_item">
            <a>
                <xsl:if test="$DOC_PROPS[@name='ID']!=field[@name='Id']">
                    <xsl:attribute name="href">
                                <xsl:choose>
                                    <xsl:when test="field[@name='Redirect']=''"><xsl:value-of select="$LANG_ABBR"/><xsl:value-of select="field[@name='Segment']"/></xsl:when>
                                    <xsl:otherwise><xsl:value-of select="field[@name='Redirect']"/></xsl:otherwise>
                                </xsl:choose>
                            </xsl:attribute>
                </xsl:if>
                <xsl:value-of select="field[@name='Name']"/>
            </a>
            <xsl:apply-templates select="recordset"/>
        </li>
    </xsl:template>
    <!-- /PageList and NavigationMenu -->

    <!-- MainMenu -->
    <xsl:template match="component[@name='mainMenu']">
    	<xsl:apply-templates/>
    </xsl:template>

    <xsl:template match="recordset[ancestor::component[@name='mainMenu']]">
        <xsl:if test="not(@empty)">
            <ul class="main_menu clearfix">
                <xsl:apply-templates/>
            </ul>
        </xsl:if>
    </xsl:template>

    <xsl:template match="recordset[parent::component[@name='mainMenu']]">
        <xsl:if test="not(@empty)">
            <ul class="main_menu clearfix">
                <xsl:if test="$DOC_PROPS[@name='main'] != 1">
                    <li class="home">
                        <a href="{$BASE}">
                            <xsl:value-of select="$TRANSLATION[@const='TXT_HOME']" disable-output-escaping="yes"/>
                        </a>
                    </li>
                </xsl:if>
                <xsl:apply-templates/>
            </ul>
        </xsl:if>        
    </xsl:template>

    <xsl:template match="record[ancestor::component[@name='mainMenu']]">
        <li>
            <xsl:attribute name="class">main_menu_item<xsl:if test="field[@name='Id']=$ID"> active</xsl:if></xsl:attribute>
            <a>                                
                <xsl:attribute name="href"><xsl:choose>
                    <xsl:when test="field[@name='Redirect']=''"><xsl:value-of select="$LANG_ABBR"/><xsl:value-of select="field[@name='Segment']"/></xsl:when>
                    <xsl:otherwise><xsl:value-of select="field[@name='Redirect']"/></xsl:otherwise>
                </xsl:choose></xsl:attribute>
                <xsl:value-of select="field[@name='Name']"/></a>
                <xsl:if test="recordset">
                    <xsl:apply-templates select="recordset"/>
                </xsl:if>
        </li>
    </xsl:template>
    <!-- /MainMenu -->

    <!-- LangSwitcher -->
    <xsl:template match="component[@class='LangSwitcher']">
        <xsl:apply-templates/>
    </xsl:template>

    <xsl:template match="recordset[parent::component[@class='LangSwitcher']]">
        <xsl:if test="count(record)&gt;1">
            <ul class="lang_switcher">
                <xsl:apply-templates/>
            </ul>
        </xsl:if>
    </xsl:template>

    <xsl:template match="record[ancestor::component[@class='LangSwitcher']]">
        <li class="lang_switcher_item">
            <a>
                <xsl:if test="$LANG_ID != field[@name='lang_id']">
                    <xsl:attribute name="href"><xsl:value-of select="field[@name='lang_url']"/></xsl:attribute>
                </xsl:if>
                <xsl:value-of select="field[@name='lang_name']"/>
            </a>    
        </li>
    </xsl:template>
    <!-- /LangSwitcher -->

    <!-- BreadCrumbs -->
    <xsl:template match="component[@name='breadCrumbs']">
        <xsl:if test="count(recordset/record) &gt; 1">
            <xsl:apply-templates/>
        </xsl:if>
    </xsl:template>
    
    <xsl:template match="recordset[parent::component[@name='breadCrumbs']]">
        <div class="breadcrumbs">
            <xsl:apply-templates/>
        </div>
    </xsl:template>
    
    <xsl:template match="record[ancestor::component[@name='breadCrumbs']]">
        <xsl:choose>
            <xsl:when test="position() = 1">
                <a href="{$BASE}{$LANG_ABBR}" class="breadcrumbs_home"><xsl:value-of select="field[@name='Name']"/></a> /
            </xsl:when>
            <xsl:when test="position() = last()">
                <xsl:value-of select="field[@name='Name']"/>
            </xsl:when>
            <xsl:otherwise>
                <xsl:if test="field[@name='Id'] != ''">
                    <a href="{$BASE}{$LANG_ABBR}{field[@name='Segment']}"><xsl:value-of select="field[@name='Name']"/></a> /
                </xsl:if>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>
    
    <!--<xsl:template match="record[position() = last()][ancestor::component[@class='BreadCrumbs']]">-->
        <!--<xsl:if test="field[@name='Id'] != ''">-->
            <!--<xsl:value-of select="field[@name='Name']"/>-->
        <!--</xsl:if>-->
    <!--</xsl:template>-->
    <!-- /BreadCrumbs -->

    <!-- SitemapTree -->
    <xsl:template match="component[@class='SitemapTree']">
        <xsl:apply-templates/>
    </xsl:template>

    <xsl:template match="recordset[ancestor::component[@class='SitemapTree']]">
        <ul class="main_menu clearfix">
            <xsl:apply-templates/>
        </ul>
    </xsl:template>

    <xsl:template match="record[ancestor::component[@class='SitemapTree']]">
        <li>
            <xsl:attribute name="class">main_menu_item<xsl:if test="field[@name='Id'] = $DOC_PROPS[@name='ID']"> active</xsl:if></xsl:attribute>            
            <a href="{$BASE}{$LANG_ABBR}{field[@name='Segment']}"><xsl:value-of select="field[@name='Name']"/></a>
            <xsl:apply-templates/>
        </li>
    </xsl:template>

    <xsl:template match="field[ancestor::component[@class='SitemapTree']]"/>
    <!-- /SitemapTree -->

    <!-- PageMedia -->
    <xsl:template match="component[@class='PageMedia']">
        <xsl:if test="recordset/record[1]/field[@name='attachments']/recordset">
            <div class="media_box">
                <xsl:apply-templates select="recordset/record[1]/field[@name='attachments']" mode="player">
                    <xsl:with-param name="PLAYER_WIDTH">664</xsl:with-param>
                    <xsl:with-param name="PLAYER_HEIGHT">498</xsl:with-param>
                </xsl:apply-templates>
                <xsl:apply-templates select="recordset/record[1]/field[@name='attachments']" mode="carousel">
                    <xsl:with-param name="PREVIEW_WIDTH">90</xsl:with-param>
                    <xsl:with-param name="PREVIEW_HEIGHT">68</xsl:with-param>
                </xsl:apply-templates>
            </div>
        </xsl:if>
    </xsl:template>
    <!-- /PageMedia -->

    <!-- QuestionEditor -->
    <xsl:template match="/document/translations[translation[@component='questionEditor']]">
        <xsl:if test="$COMPONENTS[@class='QuestionEditor']/@type='foвщсгьутеrm'">
            <script type="text/javascript">
                <xsl:for-each select="translation">
                    Energine.translations.set('<xsl:value-of select="@const"/>', '<xsl:value-of select="."/>');
                </xsl:for-each>
            </script>
        </xsl:if>
    </xsl:template>
    <!-- /QuestionEditor -->
    
</xsl:stylesheet>
